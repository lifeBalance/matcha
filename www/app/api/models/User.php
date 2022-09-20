<?php

class User
{
    private $conn;
    public  $errors = [];

    public function __construct()
    {
        $this->conn = Database::connect();
    }

    public function getAll()
    {
        $stmt = $this->conn->prepare("SELECT * FROM users");
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function getByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function getByUsername($username)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function create($data)
    {
        $username   = $data['username'];
        $firstname  = $data['firstname'];
        $lastname   = $data['lastname'];
        $email      = $data['email'];
        $password   = $data['password'];

        // Double check with the DB
        // Check that the username doesn't exist in the database!!!
        // Check that the email doesn't exist in the database!!!
        if ($this->getByUsername($username) ||
            $this->getByEmail($email))
        {
            return false;
        }

        // Hash the password
        $pwd_hash = password_hash($password, PASSWORD_DEFAULT);

        // Generate Email Token (for account confirmation and password resetting)
        $hash_me = bin2hex(random_bytes(16));
        $token = hash_hmac('sha256', $hash_me, EMAIL_TOKENS_KEY); // sha256 = 64 characters

        // Let's write to the DB
        $sql = 'INSERT INTO users (
                    username, firstname, lastname, email, pwd_hash, email_token
                )
                VALUES (
                    :username, :firstname, :lastname, :email, :pwd_hash, :email_token
                )';
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':firstname', $firstname, PDO::PARAM_STR);
        $stmt->bindValue(':lastname', $lastname, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':pwd_hash', $pwd_hash, PDO::PARAM_STR);
        $stmt->bindValue(':email_token', $token, PDO::PARAM_STR);
        $stmt->execute();

        return $this->getByUsername($username);
    }
}