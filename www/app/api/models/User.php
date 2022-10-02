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

    public function getPage($page, $items_per_page)
    {
        $offset = ($page - 1) * $items_per_page; // offset is the starting row
        $sql = 'SELECT * FROM users
                LIMIT :offset, :items_per_page';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindValue(':items_per_page', $items_per_page, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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

    public function updatePassword($email, $password)
    {
        // Hash the password (PASSWORD_DEFAULT = bcrypt algorithm)
        $pwd_hash = password_hash($password, PASSWORD_DEFAULT);

        $sql = 'UPDATE users
                SET pwd_hash = :pwd_hash
                WHERE email = :email';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':pwd_hash', $pwd_hash, PDO::PARAM_STR);
        return $stmt->execute(); // true or false
    }

    public function getByUsername($username)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function confirmAccount($uid)
    {
        $sql = 'UPDATE users
                SET confirmed = 1
                WHERE id = ?';
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$uid]);
    }

    public function deleteConfirmToken($uid)
    {
        $sql = 'DELETE FROM email_tokens email_token
                WHERE user_id = ?';
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$uid]);
    }

    public function create($data)
    {
        $username       = $data['username'];
        $firstname      = $data['firstname'];
        $lastname       = $data['lastname'];
        $email          = $data['email'];
        $password       = $data['password'];

        // Double check with the DB (in case of front-end tampering)
        // Check that the username doesn't already exist in the database!!!
        // Check that the email doesn't already exist in the database!!!
        if ($this->getByUsername($username) ||
            $this->getByEmail($email))
        {
            return false;
        }

        // Hash the password
        $pwd_hash = password_hash($password, PASSWORD_DEFAULT);

        // Let's write to the DB
        $sql = 'INSERT INTO users (
                    username, firstname, lastname, email, pwd_hash
                )
                VALUES (
                    :username, :firstname, :lastname, :email, :pwd_hash
                )';

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':firstname', $firstname, PDO::PARAM_STR);
        $stmt->bindValue(':lastname', $lastname, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':pwd_hash', $pwd_hash, PDO::PARAM_STR);
        $stmt->execute();

        return $this->getByUsername($username);
        // return $stmt->fetch(PDO::FETCH_OBJ);
        // echo json_encode(['user created' => $stmt->fetch(PDO::FETCH_OBJ)]);exit;
    }
    public function update($data)
    {
        $sql = 'UPDATE users
                SET
                    firstname = :firstname,
                    lastname = :lastname,
                    email = :email,
                    confirmed = :confirmed
                WHERE id = :id';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':firstname', $data['firstname'], PDO::PARAM_STR);
        $stmt->bindValue(':lastname', $data['lastname'], PDO::PARAM_STR);
        $stmt->bindValue(':email', $data['email'], PDO::PARAM_STR);
        $stmt->bindValue(':confirmed', $data['confirmed'], PDO::PARAM_INT);
        $stmt->bindValue(':id', $data['id'], PDO::PARAM_INT);

        return $stmt->execute(); // true if everything's aight!
    }

}