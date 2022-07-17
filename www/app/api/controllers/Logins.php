<?php
class Logins
{
    // Create (POST): For logging in
    public function create()
    {
        $email = $_POST['email']; // sanitize
        $userModel = new User();
        $user = $userModel->findByEmail($email);
        echo json_encode("user $user->username logged in!");
    }

    // Read (GET): collection.
    public function index($args)
    {
    }

    // Read (GET): one.
    public function show($args)
    {
    }

    // Update (POST): For modifying the password
    public function update($args)
    {
        $id = $args['id'];
        echo json_encode("user $id updating credentials");
    }

    // Delete (DELETE): For logging out
    public function delete($args)
    {
        $id = $args['id'];
        echo json_encode("user $id logging out");
    }
}