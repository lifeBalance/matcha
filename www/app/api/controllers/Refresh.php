<?php
class Refresh
{
    private $userModel;

    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $this->userModel = new User();
        $this->refreshTokenModel = new RefreshToken();
    }

    // POST -> /refresh: For creating new pair of tokens (deleting old refresh)
    public function create()
    {
        $data = json_decode(file_get_contents('php://input'));
        $old_refresh_token = $data->refreshToken;

        if (strlen($old_refresh_token) === 0) {
            http_response_code(400);    // 400 Bad Request
            echo json_encode([
                "message" => "missing token"
            ]);
            exit;
        } else {
            // Sanitize token (just in case)
            $old_refresh_token = filter_var($old_refresh_token, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            // Check the refresh token is not expired
            $payload = JWT::decode($old_refresh_token);
            if ($payload) {
                $user_id = $payload['sub'];
                $user = $this->userModel->getById($user_id);
                // If there's a user with that ID
                if ($user) {
                    // Check the refresh token is in the white list
                    $whitelisted = $this->refreshTokenModel->token_exists($old_refresh_token);

                    if (!$whitelisted) {
                        http_response_code(400);
                        echo json_encode([
                            'message'   => 'invalid token (not in whitelist)'
                        ]);
                        exit ;
                    }

                    // Generate NEW tokens with new expiry dates (Token Rotation)
                    $new_access_token = JWT::encode([
                        'sub'   => $user->id,
                        'email' => $user->email,
                        'exp' => time() + ACCESS_TOKEN_EXP
                    ]);
                    $new_refresh_token_expiry = time() + REFRESH_TOKEN_EXP;
                    $new_refresh_token = JWT::encode([
                        'sub'   => $user->id,
                        'exp' => $new_refresh_token_expiry
                    ]);

                    // Delete old refresh token from db
                    $this->refreshTokenModel->delete($old_refresh_token);

                    // Save new refresh token to db
                    $this->refreshTokenModel->create($new_refresh_token, $new_refresh_token_expiry);

                    // Send response back (log them for now; set somewhere later)
                    echo json_encode([
                        'access_token'  => $new_access_token,
                        'refresh_token' => $new_refresh_token
                    ]);
                }
            }
        }
    }
}