<?php

class Users
{
    private $userModel;

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
            Auth::authorize($_SERVER['HTTP_AUTHORIZATION']);
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
            'subject'   => 'Confirm your Matcha account',
            'body'      =>
                "<h1>Welcome to Matcha</h1>
                <p>Please, click <a href=\"https://localhost/confirm/{$user['email']}/{$email_token}\" >here</a> to get the party started!</p>"
        ]);
    }

    // Create (POST -> /api/users): For creating a User Account (Sign Up)
    public function create()
    {
        // Account info (sent as raw JSON data in a POST request)
        $data = json_decode(file_get_contents('php://input'));
        // echo json_encode($data);

        // Let's sanitize, in case some little shit messed with our front-end
        $username   = filter_var($data->username, FILTER_SANITIZE_SPECIAL_CHARS);
        $firstname  = filter_var($data->firstName, FILTER_SANITIZE_SPECIAL_CHARS);
        $lastname   = filter_var($data->lastName, FILTER_SANITIZE_SPECIAL_CHARS);
        $email      = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        $password   = filter_var($data->password, FILTER_SANITIZE_SPECIAL_CHARS);
        $pwd_conf   = filter_var($data->passwordConf, FILTER_SANITIZE_SPECIAL_CHARS);

        // Double check string lengths are consistent with our front-end regexes
        if (strlen($username) < 2 || strlen($username) > 10 ||
            strlen($firstname) < 2 || strlen($firstname) > 30 ||
            strlen($lastname) < 2 || strlen($lastname) > 30 ||
            $email === false ||
            strlen($password) < 5 || strlen($password) > 10 || $password !== $pwd_conf)
        {
            http_response_code(400); // Bad Request
            echo json_encode('Shenanigans...');
            exit;
        }

        // Generate Email Token (account confirmation and password resetting)
        $email_token = bin2hex(random_bytes(16)); // 32 chars

        $clean_data = [
            'username'      => $username,
            'firstname'     => $firstname,
            'lastname'      => $lastname,
            'email'         => $email,
            'password'      => $password
        ];

        // Call the model method to create a user in the DB
        $user = $this->userModel->create($clean_data);
        // echo json_encode(['created user'=>$user->firstname]);exit;
        if ($user) {
            // Instantiate the emailToken class (model) to create email token in DB
            $emailTokenModel = new EmailToken();
            $createdToken = $emailTokenModel->create($user->email,
                                                    $email_token,
                                                    time() + EMAIL_TOKEN_EXP);
                                                    // echo json_encode($createdToken);exit;
            if ($createdToken) {
                // Sent a Confirmation Email with the token
                $this->sendMail($clean_data, $createdToken->email_token);

                // Create a profile (mostly empty) linked to her id
                $profileModel = new Profile();
                $ret = $profileModel->create($user->id);
                // echo json_encode($ret); // testing
            }
        }
    }

    // Read (GET): collection or single resource.
    public function read($args = [])
    {
        // Read single resource
        if (!empty($args)) {
            // Extract uid from access token, see if user can access user
            $this->authorize();
            // WARNING: CHECK for BLOCKED USERS (don't serve profile to them)!!
            // echo json_encode($args['id']); // prints 1 if /api/users?id=1
            $user = $this->userModel->getById($args['id']);
            $profile = $this->profileModel->getById($args['id']);

            // Let's gather pictures in user's folder (if any)
            $pics = [];
            $user_dir = UPLOADS_DIR . "/{$args['id']}";
            if (is_dir($user_dir))
                $pics = array_diff(scandir($user_dir), array('.', '..'));

            echo json_encode([
                'id'        => $user->id,
                'userName'  => $user->username,
                'firstName' => $user->firstname,
                'lastName'  => $user->lastname,
                'gender'    => $profile->gender,
                'prefers'   => $profile->prefers,
                'bio'       => html_entity_decode($profile->bio, ENT_QUOTES),
                'pics'      => array_values($pics)
            ]);
            exit;
        } else {    // Read collection
            $this->authorize();
            $users = $this->userModel->getAll();
            echo json_encode($users);
        }
    }

    // Answer Preflight request (During development, client is served from
    // the development server (Vite) at https://127.0.0.1:5173
    // public function answer_preflight_request($args)
    // {
    //     // header('Access-Control-Allow-Origin:  https://127.0.0.1:5173');
    //     header('Access-Control-Allow-Origin:  *');
    //     header('Access-Control-Allow-Methods: GET');
    //     header('Access-Control-Allow-Headers: Content-Type, Authorization');
    //     echo json_encode("OK");
    // }
}