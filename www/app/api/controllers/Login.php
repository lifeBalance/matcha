<?php
class Login
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
        $this->refreshTokenModel = new RefreshToken();
    }

    // POST -> /login: For logging in
    public function create()
    {
        // Login credentials (sent as raw JSON data in a POST request)
        $data = json_decode(file_get_contents('php://input'));
        // Maybe there's an old Refresh Token in the httponly cookie
        $old_refresh_token = $_COOKIE['refreshToken'];

        // Sanitize all things
        $username   = filter_var($data->username, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $password   = filter_var($data->password, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        // Check if they're empty
        if (empty($username) || empty($password)) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(400);    // 400 Bad Request
            echo json_encode([
                "message" => "missing login credentials"
            ]);
            exit;
        }

        // Retrieve the user (if exists in the db)
        $user = $this->userModel->getByUsername($username);

        // Non-existing User
        if (!$user) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(401);    // 401 Unauthorized
            echo json_encode([
                "message" => "user doesn't exist"
            ]);
            exit;
        }

        // Invalid password
        if (!password_verify($password, $user->pwd_hash)) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(401);    // 401 Unauthorized
            echo json_encode([
                "message" => "incorrect password"
            ]);
            exit;
        }

        // Account NOT confirmed
        if (!$user->confirmed) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(401);    // 401 Unauthorized
            echo json_encode([
                "message" => "account not confirmed"
            ]);
            exit;
        }

        // All is good!!
        // Delete the old Refresh Token (new one is gonna be generated)
        if ($old_refresh_token)
            $this->refreshTokenModel->delete($old_refresh_token);

        // Generate a new pair of tokens:
        $access_token = JWT::encode([
            'sub'   => $user->id,
            'email' => $user->email,
            'exp' => time() + ACCESS_TOKEN_EXP
        ]);
        $refresh_token_expiry = time() + REFRESH_TOKEN_EXP;
        $refresh_token = JWT::encode([
            'sub' => $user->id,
            'exp' => $refresh_token_expiry
        ]);

        // Save new Refresh Token to DB (white-list)
        $this->refreshTokenModel->create($user->id, $refresh_token, $refresh_token_expiry);

        // Set Refresh token in http-only cookie
        // For developing our SPA set temporarily SameSite=None
        // (at deploy SameSite=Strict)
        setcookie('refreshToken', $refresh_token, [
            'path'      => '/api',
            'secure'    => true,
            'expires'   => time() + $refresh_token_expiry,
            'httponly'  => true,
            'samesite'  => 'None'
        ]);

        // Send Access token in the response body
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'access_token'  => $access_token
        ]); // 200 OK (default)
    }
}