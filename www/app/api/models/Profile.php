<?php
class Profile
{
    private $conn;

    public function __construct()
    {
        $this->conn = Database::connect();
    }

    public function getByUserId($uid)
    {
        $stmt = $this->conn->prepare("SELECT * FROM profiles WHERE user_id = ?");
        $stmt->execute([$uid]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function create($uid)
    {
        $sql = 'INSERT INTO profiles (id) VALUES (?)';
        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([$uid]); // true if everything's aight!
    }
}