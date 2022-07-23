<?php
class Auth
{
    public static function authorize($auth_header)
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
                    return $payload;
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
}