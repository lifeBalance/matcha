<?php

class Users
{
    private $userModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');
        try {
            Auth::authorize($_SERVER['HTTP_AUTHORIZATION']);
        } catch (ExpiredTokenException) {
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Invalid token error']);
            die;
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => $e->getMessage()]);
            die;
        }
        $this->userModel = new User();
    }

    // Create (POST -> /api/users): For creating a user
    public function create()
    {
        echo json_encode("creating new user {$_POST['email']}");
    }

    // Read (GET): collection.
    public function index($args)
    {
        $users = $this->userModel->getAll();
        echo json_encode($users);
    }

    // Read (GET): one.
    public function show($args)
    {
        $id = $args['id'];
        // Retrieve the user
        $user = $this->userModel->getById($id);
        echo json_encode($user);
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