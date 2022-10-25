<?php
class EmailToken
{
    private $conn;

    public function __construct()
    {
        $this->conn = Database::connect();
    }

    // public function getByUserId($uid)
    // {
    //     $stmt = $this->conn->prepare("SELECT * FROM email_tokens WHERE user_id = ?");
    //     $stmt->execute([$uid]);

    //     return $stmt->fetch(PDO::FETCH_OBJ);
    // }

    public function getByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT * FROM email_tokens WHERE email = ?");
        $stmt->execute([$email]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function create($email, $email_token, $expires_at)
    {
        $sql = 'INSERT INTO email_tokens (email, email_token, expires_at)
                VALUES (:email, :email_token, :expires_at)';
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':email_token', $email_token, PDO::PARAM_STR);
        $stmt->bindValue(':expires_at', $expires_at, PDO::PARAM_INT);
        $stmt->execute();

        // return $stmt->fetch(PDO::FETCH_OBJ);
        return $this->getByEmail($email);
    }

    public function deleteByEmail($email): int
    {
        $sql = 'DELETE FROM email_tokens email_token
                WHERE email = :email';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function deleteExpired (): int
    {
        $sql = 'DELETE FROM email_tokens
                WHERE expires_at < UNIX_TIMESTAMP()';
        $stmt = $this->conn->query($sql); 
        return $stmt->rowCount();
    }
}