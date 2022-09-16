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
        // $hash = hash_hmac('sha256', $token, SECRET_JWT_KEY);
        $hash = hash('sha256', $token);
        $sql = 'INSERT INTO refresh_tokens (token_hash, expires_at)
                VALUES (:token_hash, :expires_at)';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':token_hash', $hash, PDO::PARAM_STR);
        $stmt->bindValue(':expires_at', $expiry, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function delete(string $token): int
    {
        // $hash = hash_hmac('sha256', $token, SECRET_JWT_KEY);
        $hash = hash('sha256', $token);
        $sql = 'DELETE FROM refresh_tokens token_hash
                WHERE token_hash = :token_hash';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':token_hash', $hash, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function deleteExpired (): int
    {
        $sql = 'DELETE FROM refresh_tokens
                WHERE expires_at < UNIX_TIMESTAMP()';
        $stmt = $this->conn->query($sql); 
        return $stmt->rowCount();
    }

    public function token_exists(string $token): array | false
    {
        // Hash the token argument to compare it to the HASHED one in the DB
        // $hash = hash_hmac('sha256', $token, SECRET_JWT_KEY);
        $hash = hash('sha256', $token);
        echo json_encode($hash);
        $sql = 'SELECT *
                FROM refresh_tokens
                WHERE token_hash = :token_hash';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':token_hash', $hash, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}