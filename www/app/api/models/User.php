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

    public function create($data)/// RENAME ACTION TO NEW!!!
    {
        // Fill errors array (if there's any errors in the form) 
        // $this->validateSignUp($data);

        // No errors in the form
        if (empty($this->errors)) {
            // Check that the username doesn't exist in the database!!!
            if ($this->getByUsername($data['username']))
                return ['error' => 'User with that nick already exists'];

            if ($this->getByEmail($data['email']))
                return ['error' => 'User with that email already exists'];

            // Check both submitted passwords match
            if ($data['password'] != $data['pwdConfirm'])
                return ['error' => 'Passwords do not match'];

            // Hash the password
            $pwd_hash = password_hash($data['password'], PASSWORD_DEFAULT);

            // Let's write to the DB
            $sql = 'INSERT INTO users (username, email, pwd_hash)
                    VALUES (:username, :email, :pwd_hash)';
            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':username', $data['username'], PDO::PARAM_STR);
            $stmt->bindValue(':email', $data['email'], PDO::PARAM_STR);
            $stmt->bindValue(':pwd_hash', $pwd_hash, PDO::PARAM_STR);
            $stmt->execute();

            return ['user' => $this->getByUsername($data['username'])];
        }
    }
}