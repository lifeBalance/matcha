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

    public static function decode($token)
    {
        if (preg_match("/^(?<header>.+)\.(?<payload>.+)\.(?<signature>.+)$/", 
                        $token,
                        $components) == false)
            return false;
        // Calculate a new signature based on the token's first two components.
        $signature =  hash_hmac(
            'sha256',
            "{$components['header']}.{$components['payload']}",
            SECRET_JWT_KEY,
            true);
        // Encode the new signature in base64url (like the original one is)
        $signature = self::base64UrlEncode($signature);
        // Compare the new signature with the original signature.
        if (!hash_equals($signature, $components['signature']))
            return false;
        // Return the decoded payload as an associative array.
        return json_decode(self::base64UrlDecode($components['payload']), true);
    }

    private static function base64UrlEncode(string $str)
    {
        return str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode($str)
        );
    }

    private static function base64UrlDecode(string $str)
    {
        return base64_decode(
            str_replace(
                ['-', '_'],
                ['+', '/'],
                $str
            )
        );
    }
}