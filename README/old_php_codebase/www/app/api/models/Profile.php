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

    public function getProfilePic($uid)
    {
        $sql = 'SELECT profile_pic FROM profiles WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
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
                    age         = :age,
                    gender      = :gender,
                    prefers     = :prefers,
                    bio         = :bio,
                    profile_pic = :profile_pic
                WHERE id = :id';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $data['id'], PDO::PARAM_INT);
        $stmt->bindValue(':age', $data['age'], PDO::PARAM_INT);
        $stmt->bindValue(':gender', $data['gender'], PDO::PARAM_INT);
        $stmt->bindValue(':prefers', $data['prefers'], PDO::PARAM_INT);
        $stmt->bindValue(':bio', $data['bio'], PDO::PARAM_STR);
        $stmt->bindValue(':profile_pic', $data['profile_pic'], PDO::PARAM_STR);

        return $stmt->execute(); // true if everything's aight!
    }
}