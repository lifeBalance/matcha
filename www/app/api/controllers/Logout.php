<?php
class Logout
{
    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $this->refreshModel = new RefreshToken();
    }

    // POST -> /login: For logging out
    public function create()
    {
        if (!array_key_exists('token',    $_POST)) {
            http_response_code(400); // 400 Bad Request
            echo json_encode([
                "message" => "missing token"
            ]);
            exit;
        } else {
            $token = filter_var($_POST['token'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            // Check the refresh token is not expired
            $payload = JWT::decode($token);
            if ($payload) {
                if ($this->refreshModel->token_exists($token)) {
                    // Delete current refresh token from db
                    $this->refreshModel->delete($token);
                    echo json_encode([
                        "message" => "token deleted"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "invalid token (not in whitelist)"
                    ]);
                }
            }
        }
    }
}