<?php
class Logins
{
    private $userModel;

    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $this->userModel = new User();
    }

    // Create (POST -> /login): For logging in
    public function create()
    {
        if (!array_key_exists('email',    $_POST) ||
            !array_key_exists('password', $_POST))
        {
            http_response_code(400);            // 400 Bad Request
            echo json_encode(["message" => "missing login credentials"]);
            exit;
        }
        // Sanitize all things
        $email      = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $password   = filter_var($_POST['password'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        // Retrieve the user
        $user = $this->userModel->findByEmail($email);

        // Validate credentials
        if (!$user) {
            http_response_code(401);            // 401 Unauthorized
            echo json_encode(["message" => "invalid authentication"]);
            exit;
        }
        if (!password_verify($password, $user->pwd_hash)) {
            http_response_code(401);            // 401 Unauthorized
            echo json_encode(["message" => "invalid authentication"]);
            exit;
        }

        // Send response back
        // echo json_encode($user); // 200 OK (default)
        echo json_encode(['message' => 'successful authentication']); // 200 OK (default)
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