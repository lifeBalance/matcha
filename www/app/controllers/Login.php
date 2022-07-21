<?php
class Login
{
    private $userModel;

    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $this->userModel = new User();
    }

    // Create (POST -> /login): For logging in
    public function create()
    {
        if (!array_key_exists('email',    $_POST) ||
            !array_key_exists('password', $_POST))
        {
            http_response_code(400);    // 400 Bad Request
            echo json_encode(["message" => "missing login credentials"]);
            exit;
        } else {
            // Sanitize all things
            $email      = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
            $password   = filter_var($_POST['password'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            // Check if they're empty
            if (empty($email) || empty($password)) {
                http_response_code(400);    // 400 Bad Request
                echo json_encode(["message" => "missing login credentials"]);
                exit;
            }
        }

        // Retrieve the user (if exists in the db)
        $user = $this->userModel->getByEmail($email);

        // User with that email does not exist.
        if (!$user) {
            http_response_code(401);    // 401 Unauthorized
            echo json_encode(["message" => "invalid authentication"]);
            exit;
        }
        // Validate credentials
        if (!password_verify($password, $user->pwd_hash)) {
            http_response_code(401);    // 401 Unauthorized
            echo json_encode(["message" => "invalid authentication"]);
            exit;
        }
        // Generate the tokens (better set expiry times in environment var: time() + ACCESS_EXP).
        $access_token = JWT::encode([
            'sub'   => $user->id,
            'email' => $user->email,
            'exp' => time() + ACCESS_TOKEN_EXP
        ]);
        $refresh_token = JWT::encode([
            'sub'   => '69',
            'exp' => time() + REFRESH_TOKEN_EXP
        ]);

        // Send response back (log them for now; set somewhere later)
        echo json_encode([
            'access_token'  => $access_token,
            'refresh_token' => $refresh_token
        ]); // 200 OK (default)
    }
}