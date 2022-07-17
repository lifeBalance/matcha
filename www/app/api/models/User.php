<?php

class User
{
    private $conn;

    public function __construct()
    {
        $this->conn = Database::connect();
    }

    public function findByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
}