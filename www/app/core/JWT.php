<?php
class JWT
{
    public static function encode($payload)
    {
        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];
        // Encode the header (JSON + base64url)
        $header = self::base64UrlEncode(json_encode($header));

        // Encode the payload (JSON + base64url)
        $payload = self::base64UrlEncode(json_encode($payload));

        // Hash the signature (using the secret key)
        $signature = hash_hmac(
            'sha256',
            "$header.$payload",
            SECRET_JWT_KEY,
            true);

        // Encode it using base64url
        $signature = self::base64UrlEncode($signature);

        // Assemble and return the token
        return "$header.$payload.$signature";
    }

    public static function base64UrlEncode(string $data)
    {
        return str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode($data));
    }
}