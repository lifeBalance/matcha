<?php
class RefreshToken
{
    private $conn;

    public function __construct()
    {
        $this->conn = Database::connect();
    }

    public function create($token, $expiry)
    {
        $hash = hash_hmac('sha256', $token, SECRET_JWT_KEY);
        $sql = 'INSERT INTO refresh_tokens (token_hash, expires_at)
                VALUES (:token_hash, :expires_at)';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':token_hash', $hash, PDO::PARAM_STR);
        $stmt->bindValue(':expires_at', $expiry, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function delete(string $token): int
    {
        $hash = hash_hmac('sha256', $token, SECRET_JWT_KEY);
        $sql = 'DELETE FROM refresh_tokens token_hash
                WHERE token_hash = :token_hash';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':token_hash', $hash, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function token_exists(string $token): array | false
    {
        $hash = hash_hmac('sha256', $token, SECRET_JWT_KEY);
        $sql = 'SELECT *
                FROM refresh_tokens
                WHERE token_hash = :token_hash';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':token_hash', $hash, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}