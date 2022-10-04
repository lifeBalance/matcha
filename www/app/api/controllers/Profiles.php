<?php

class Profiles
{
    private $userModel;
    private $profileModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        // header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
        $this->profileModel = new Profile();
    }

    // Send the Account confirmation mail
    private function sendMail(Array $user, String $email_token)
    {

        $mail = new Mailer();
        $mail->send_mail([
            'recipient' => $user['email'],
            'username'  => $user['firstname'],
            'subject'   => 'Matcha - Confirm your new email',
            'body'      =>
                "<h1>You modified your email account</h1>
                <p>Please, click <a href=\"https://localhost/confirm/{$user['email']}/{$email_token}\" >here</a> to confirm the changes!</p>"
        ]);
    }

    private function savePic($pic, $uid)
    {
        if (is_uploaded_file($pic['tmp_name'])) {
            if ($pic['size'] > 200000 ||
                !preg_match('/^(image\/)(png|jpe?g|gif)$/', $pic['type']) ||
                !getimagesize($pic['tmp_name']))
            {
                http_response_code(400); // Bad Request
                echo json_encode('shenanigans');
                exit;
            }
            // Get the mime type
            $mime = getimagesize($pic['tmp_name'])['mime'];
            // Extract extension
            $ext = explode('/', $mime)[1];
            // Generate unique filename
            $name = uniqid();
            // Create a user's directory if it doesn't exist
            $user_dir = UPLOADS_DIR . "/$uid";
            if (!is_dir($user_dir)) mkdir($user_dir, 0777, true);
            // Move the pic to the user's directory
            $src = $pic['tmp_name'];
            $dst = $user_dir . "/$name.$ext";
            move_uploaded_file($src, $dst);

            return "uploads/$uid/$name.$ext";  // RELATIVE path to the picture
        } else {
            http_response_code(400); // Bad Request
            echo json_encode('shenanigans: no file uploaded');
            exit;
        }
    }

    // Create (POST -> /api/profiles): For modifying a user's profile
    public function create()
    {
        // Extract the User ID from the token in the Authorization Header.
        $accessTokenUid =  Auth::getUidFromToken($_SERVER['HTTP_AUTHORIZATION']);

        $profile_pic = $this->profileModel->getProfilePic($accessTokenUid)->profile_pic; // either NULL or relative path to the image

        // Are there files in the request? Save them to the user's folder.
        // Here I should count the existing files, so they can't be more than 5!
        if (isset($_FILES)) {
            foreach ($_FILES as $k => $pic) {
                // Save the 'profile_pic' ONLY if it's not set (empty string)
                if ($k === array_key_first($_FILES) &&
                    $profile_pic === '')
                {
                    $profile_pic = $this->savePic($pic, $accessTokenUid);
                    // echo json_encode($profile_pic);exit;
                } else
                    $this->savePic($pic, $accessTokenUid);
            }
        }

        // Profile data (this time sent in a POST request)
        // Let's sanitize, in case some little shit messed with our front-end
        if (isset($_POST['firstName']))
            $firstname = filter_var($_POST['firstName'], FILTER_SANITIZE_SPECIAL_CHARS);
        if (isset($_POST['lastName']))
            $lastname = filter_var($_POST['lastName'], FILTER_SANITIZE_SPECIAL_CHARS);
        if (isset($_POST['email']))
            $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        if (isset($_POST['bioValue']))
            $bio = filter_var($_POST['bioValue'], FILTER_SANITIZE_SPECIAL_CHARS);
        if (isset($_POST['age']))
            $age = filter_var($_POST['age'], FILTER_VALIDATE_INT);
        if (isset($_POST['genderValue']))
            $gender = filter_var($_POST['genderValue'], FILTER_VALIDATE_INT);
        if (isset($_POST['preferencesValue']))
            $prefers = filter_var($_POST['preferencesValue'], FILTER_VALIDATE_INT);

        // Double check data consistent with our front-end regexes
        if (strlen($firstname) < 2  || strlen($firstname) > 50 ||
            strlen($lastname) < 2   || strlen($lastname) > 50 ||
            strlen($email) < 6      || strlen($email) > 255 ||
            strlen($bio) > 255      || !is_int($gender) || !is_int($prefers) ||
            $gender < 0 || $gender > 2 || $prefers < 0 || $prefers > 2 ||
            isset($age) && $age < 18)
        {
            http_response_code(400); // Bad Request
            echo json_encode('shenanigans');
            exit;
        }

        // Let's split the data according to the DB table it belongs
        $profile_data = [
            'id'            => $accessTokenUid,
            'gender'        => $gender,
            'age'           => $age,
            'prefers'       => $prefers,
            'bio'           => $bio,
            'profile_pic'   =>$profile_pic
        ];

        $user_data = [
            'id'        => $accessTokenUid,
            'firstname' => $firstname,
            'lastname'  => $lastname,
            'email'     => $email,
            'confirmed' => 1  // If the user's editing her profile, is confirmed
        ];

        // Check the user's old email
        $user = $this->userModel->getById($accessTokenUid);

        // Compare to the email received from the profile form
        if ($user->email !== $user_data['email']) {
            // Just in case, check if the new email already exists in the DB
            if ($this->userModel->getByEmail($user_data['email'])) {
                echo json_encode([ 'message' => 'email exists']);
                exit;
            }

            // Instantiate the EmailToken model
            $emailTokenModel = new EmailToken();

            // and check if the email exists in the Email Tokens table.
            // (An unconfirmed user can't log in and access the Profile form).
            if ($emailTokenModel->getByEmail($user_data['email']))
            {
                http_response_code(400); // Bad Request
                echo json_encode('shenanigans');
                exit;
            }   // There were some front-end tampering shenanigans

            // Generate Email Token (account confirmation neccesary )
            $email_token = bin2hex(random_bytes(16)); // 32 chars

            // Save Email token to DB
            $emailTokenModel->create(
                $user_data['email'], // This is the NEW email address!!
                $email_token,
                time() + EMAIL_TOKEN_EXP);

            // Send mail
            $this->sendMail($user_data, $email_token);

            // Set user to unconfirmed
            $user_data['confirmed'] = 0;
        }

        // Update data in the DB 'users' table
        $ret = $this->userModel->update($user_data);

        // Update data in the DB 'profiles' table
        $ret2 = $this->profileModel->update($profile_data);

        if ($user_data['confirmed']) {
            echo json_encode([
                'message' => 'success',
                'profilePic' => $profile_data['profile_pic']
            ]);
        } else {
            echo json_encode([ 'message' => 'confirm' ]);
        }
    }

    // Read (GET): Read a single resource: the profile of a given user
    public function read()
    {
        // Extract the User ID from the token in the Authorization Header.
        $accessTokenUid = Auth::getUidFromToken($_SERVER['HTTP_AUTHORIZATION']);

        // Compute amount of pics in user's uploads folder
        $pics_left = 5;
        $user_dir = UPLOADS_DIR . "/{$accessTokenUid}";
        if (is_dir("$user_dir")) {
            $pics_left = 5 - count(array_diff(scandir($user_dir), array('.', '..')));
            $pics = array_diff(scandir($user_dir), array('.', '..'));
        }

        // Fetch data from DB
        $profile =  $this->profileModel->getById($accessTokenUid);
        $user =     $this->userModel->getById($accessTokenUid);
        echo json_encode([
            'id'                => $user->id,
            'userName'         => $user->username,
            'firstName'         => $user->firstname,
            'lastName'          => $user->lastname,
            'email'             => $user->email,
            'age'               => $profile->age,
            'genderValue'       => $profile->gender,
            'preferencesValue'  => $profile->prefers,
            'bioValue'          => $profile->bio,
            'profilePic'        => $profile->profile_pic,
            'filesLeft'         => $pics_left,
            'pics'              => array_values($pics)
        ]);
    }
}