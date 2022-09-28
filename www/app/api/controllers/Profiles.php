<?php

class Profiles
{
    private $userModel;
    private $profileModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
        $this->profileModel = new Profile();
    }

    // Authorize request
    private function authorize()
    {
        try {
            return Auth::authorize($_SERVER['HTTP_AUTHORIZATION']);
        } catch (ExpiredTokenException) {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Invalid token error']);
            die;
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            header('Location: /404', TRUE, 301);exit; // Travolta takes it from here
            echo json_encode(['error' => $e->getMessage()]);
            die;
        }
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

    // Create (PUT -> /api/profiles): For modifying a user's profile
    public function update()
    {
        // Extract the User ID from the Access Token payload
        $accessTokenUid = $this->authorize()['sub'];    // as a string
        $accessTokenUid = (int)$accessTokenUid;         // as an int (as in DB)
        
        // Profile data (sent as raw JSON data in a PUT request)
        $data = json_decode(file_get_contents('php://input'));

        // Let's sanitize, in case some little shit messed with our front-end
        $firstname  = filter_var($data->firstName, FILTER_SANITIZE_SPECIAL_CHARS);
        $lastname   = filter_var($data->lastName, FILTER_SANITIZE_SPECIAL_CHARS);
        $email      = filter_var($data->email, FILTER_SANITIZE_EMAIL);

        $bio     = filter_var($data->bioValue, FILTER_SANITIZE_SPECIAL_CHARS);
        $gender  = filter_var($data->genderValue, FILTER_VALIDATE_INT);
        $prefers = filter_var($data->preferencesValue, FILTER_VALIDATE_INT);

        // Double check data consistent with our front-end regexes
        if (strlen($firstname) < 2  || strlen($firstname) > 50 ||
            strlen($lastname) < 2   || strlen($lastname) > 50 ||
            strlen($email) < 6      || strlen($email) > 255 ||
            strlen($bio) > 255      || !is_int($gender) || !is_int($prefers) ||
            $gender < 0 || $gender > 2 || $prefers < 0 || $prefers > 2)
        {
            http_response_code(400); // Bad Request
            echo json_encode('Shenanigans...');
            exit;
        }

        // Let's split the data according to the DB table it belongs
        $profile_data = [
            'id'        => $accessTokenUid,
            'gender'    => $gender,
            'prefers'   => $prefers,
            'bio'       => $bio
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
            echo json_encode([ 'message' => 'success' ]);
        } else {
            echo json_encode([ 'message' => 'confirm' ]);
        }
    }

    // Read (GET): Read a single resource: the profile of a given user
    public function read()
    {
        // Extract the User ID from the Access Token payload
        $accessTokenUid = $this->authorize()['sub'];    // as a string
        $accessTokenUid = (int)$accessTokenUid;         // as an int (as in DB)

        // Fetch data from DB
        $profile =  $this->profileModel->getById($accessTokenUid);
        $user =     $this->userModel->getById($accessTokenUid);
        echo json_encode([
            'firstName'         => $user->firstname,
            'lastName'          => $user->lastname,
            'email'             => $user->email,
            'genderValue'       => $profile->gender,
            'preferencesValue'  => $profile->prefers,
            'bioValue'          => $profile->bio
        ]);
    }
}