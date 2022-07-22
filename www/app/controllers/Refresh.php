<?php
class Refresh
{
    private $userModel;

    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $this->userModel = new User();
        $this->refreshModel = new RefreshToken();
    }

    // POST -> /refresh: For creating new token
    public function create()
    {
        if (!array_key_exists('token',    $_POST)) {
            http_response_code(400);    // 400 Bad Request
            echo json_encode([
                "message" => "missing token"
            ]);
            exit;
        } else {
            $token = filter_var($_POST['token'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            // Check the refresh token is not expired
            $payload = JWT::decode($token);
            if ($payload) {
                $user_id = $payload['sub'];
                $user = $this->userModel->getById($user_id);
                // If there's a user with that ID
                if ($user) {
                    // Generate tokens with new expiry dates
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
                    // Delete old refresh token from db
                    $this->refreshModel->delete($token);
                    // Save new refresh token to db
                    $this->refreshModel->create($refresh_token, $refresh_token_expiry);


                    // Send response back (log them for now; set somewhere later)
                    echo json_encode([
                        'access_token'  => $access_token,
                        'refresh_token' => $refresh_token
                    ]);
                }
            }
        }
    }
}