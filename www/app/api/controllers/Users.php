<?php

class Users
{
    private $userModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
    }

    // Authorize request
    private function authorize()
    {
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
    }

    // Create (POST -> /api/users): For creating a user
    public function create()
    {
        // Call the model method to create a user in the DB
        $result = $this->userModel->create($_POST);

        if (array_key_exists('error', $result)) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => $result['error']]);
        }
        else {
            echo json_encode(['success' => 'User created']);
        }
        exit();
    }

    // Read (GET): collection.
    public function index($args)
    {
        $this->authorize();
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

    // Answer Preflight request (During development, client is served from
    // the development server (Vite) at https://127.0.0.1:5173
    public function answer_preflight_request($args)
    {
        // header('Access-Control-Allow-Origin:  https://127.0.0.1:5173');
        header('Access-Control-Allow-Origin:  *');
        header('Access-Control-Allow-Methods: GET');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        echo json_encode("OK");
    }
}