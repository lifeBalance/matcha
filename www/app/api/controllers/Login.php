<?php
class Login
{
    private $userModel;

    public function __construct()
    {
        // header('Content-Type: application/json; charset=UTF-8');
        $this->userModel = new User();
        $this->refreshModel = new RefreshToken();
    }

    // POST -> /login: For logging in
    public function create()
    {
        $data = json_decode(file_get_contents('php://input'));
        $username = $data->username;
        $password = $data->password;

        if (strlen($username) === 0 ||
            strlen($password) === 0)
        {
            http_response_code(400);    // 400 Bad Request
            echo json_encode([
                "message" => "missing login credentials"
            ]);
            exit;
        } else {
            // Sanitize all things
            $username   = filter_var($data->username, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $password   = filter_var($data->password, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            // Check if they're empty
            if (empty($username) || empty($password)) {
                http_response_code(400);    // 400 Bad Request
                echo json_encode([
                    "message" => "2: missing login credentials"
                ]);
                exit;
            }
        }

        // Retrieve the user (if exists in the db)
        $user = $this->userModel->getByUsername($username);

        // Non-existing User
        if (!$user) {
            http_response_code(401);    // 401 Unauthorized
            echo json_encode([
                "message" => "invalid authentication"
            ]);
            exit;
        }

        // Invalid password
        if (!password_verify($password, $user->pwd_hash)) {
            http_response_code(401);    // 401 Unauthorized
            echo json_encode([
                "message" => "invalid authentication"
            ]);
            exit;
        }

        // Username/Password match!! Generate the tokens:
        $access_token = JWT::encode([
            'sub'   => $user->id,
            'email' => $user->email,
            'exp' => time() + ACCESS_TOKEN_EXP
        ]);
        $refresh_token_expiry = time() + REFRESH_TOKEN_EXP;
        $refresh_token = JWT::encode([
            'sub'   => $user->id,
            'exp' => $refresh_token_expiry
        ]);
        // Save new refresh token to DB
        $this->refreshModel->create($refresh_token, $refresh_token_expiry);

        // Set Refresh token in http-only cookie
        // Setting HttpOnly means we can't see it in Application/Cookies
        // For developing our SPA set temporarily SameSite=None
        // (at deploy SameSite=Strict)
        setcookie('refreshToken', $refresh_token, [
            'path'      => '/api',
            'secure'    => false,
            'expires'   => time() + $refresh_token_expiry,
            'httponly'  => true,
            'samesite'    => 'None'
        ]);

        // Send Access token in the response
        echo json_encode([
            'access_token'  => $access_token
        ]); // 200 OK (default)
    }
}