<?php
class Auth
{
    // private $userModel; // inject it in the constructor?

    public function __construct()
    {
        // header('Content-Type: application/json; charset=UTF-8');
        // $this->userModel = new User();
    }

    public static function authorize($auth_header)
    {
        // For testing the JWT::decode function
        if (preg_match("/^Bearer\s+(?<token>.+)$/",
        $auth_header,
        $matches) == false)
        {
            http_response_code(400);    // Bad Request
            echo json_encode(['message' => 'incomplete authorization header']);
            die;
        }
        // here I'll use try/catch for exceptions raised while decoding
        $payload = JWT::decode($matches['token']);
        if ($payload) {
            if ($payload['exp'] < time()) {
                 // throw TokenExpiredException and catch it in api controller calling authorize
                http_response_code(401);// Unauthorized
                echo json_encode(['error' => 'Invalid token error']);
                die;
            } else {
                return $payload;
            }
        }
    }

}