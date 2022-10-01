<?php
class Profile
{
    private $conn;

    public function __construct()
    {
        $this->conn = Database::connect();
    }

    public function getById($uid)
    {
        $stmt = $this->conn->prepare("SELECT * FROM profiles WHERE id = ?");
        $stmt->execute([$uid]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function create($uid)
    {
        $sql = 'INSERT INTO profiles (id) VALUES (?)';
        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([$uid]); // true if everything's aight!
    }

    public function update($data)
    {
        $sql = 'UPDATE profiles
                SET
                    age     = :age,
                    gender  = :gender,
                    prefers = :prefers,
                    bio     = :bio
                WHERE id = :id';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':age', $data['age'], PDO::PARAM_INT);
        $stmt->bindValue(':gender', $data['gender'], PDO::PARAM_INT);
        $stmt->bindValue(':prefers', $data['prefers'], PDO::PARAM_INT);
        $stmt->bindValue(':bio', $data['bio'], PDO::PARAM_STR);
        $stmt->bindValue(':id', $data['id'], PDO::PARAM_INT);

        return $stmt->execute(); // true if everything's aight!
    }
}