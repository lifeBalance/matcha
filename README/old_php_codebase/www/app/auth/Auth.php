<?php
class Auth
{
    private static function parseAuthHeader($auth_header)
    {
        // For testing the JWT::decode function
        if (preg_match("/^Bearer\s+(?<token>.+)$/",
            $auth_header,
            $matches) == false)
        {
            throw new InvalidArgumentException('No authorization header');
        }
        // Catch token decoding exceptions.
        try {
            $payload = JWT::decode($matches['token']);
            if ($payload) {
                if ($payload['exp'] < time()) {
                    throw new ExpiredTokenException();
                } else {
                    return $payload; // Array: [sub => '', email => '', exp => '']
                }
            }
        } catch (InvalidArgumentException) {
            http_response_code(401); // Unauthorized
            echo json_encode([
                'message'   => 'invalid argument'
            ]);
            return false;
        } catch (InvalidSignatureException) {
            http_response_code(401); // Unauthorized
            echo json_encode([
                'message'   => 'invalid signature'
            ]);
            return false;
        }
    }

    // Authorize request
    public static function getUidFromToken($auth_header)
    {
        try {
            $payloadArr = self::parseAuthHeader($auth_header);
            return (int)$payloadArr['sub'];
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
}