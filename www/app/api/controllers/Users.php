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

    // Create (POST -> /api/users): For creating a user (Sign Up)
    public function create()
    {
        // Account info (sent as raw JSON data in a POST request)
        $data = json_decode(file_get_contents('php://input'));
        // echo json_encode($data);

        // Let's sanitize, in case some little shit messed with our front-end
        $username   = filter_var($data->username, FILTER_SANITIZE_SPECIAL_CHARS);
        $firstname  = filter_var($data->firstName, FILTER_SANITIZE_SPECIAL_CHARS);
        $lastname   = filter_var($data->lastName, FILTER_SANITIZE_SPECIAL_CHARS);
        $email      = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        $password   = filter_var($data->password, FILTER_SANITIZE_SPECIAL_CHARS);
        $pwd_conf   = filter_var($data->passwordConf, FILTER_SANITIZE_SPECIAL_CHARS);

        // Double check string lengths are consistent with our front-end regexes
        if (strlen($username) < 2 || strlen($username) > 10 ||
            strlen($firstname) < 2 || strlen($firstname) > 30 ||
            strlen($lastname) < 2 || strlen($lastname) > 30 ||
            $email === false ||
            strlen($password) < 5 || strlen($password) > 10 || $password !== $pwd_conf)
        {
            http_response_code(400); // Bad Request
            echo json_encode('Shenanigans...');
            exit;
        }

        $clean_data = [
            'username'  => $username,
            'firstname' => $firstname,
            'lastname'  => $lastname,
            'email'     => $email,
            'password'  => $password
        ];

        // Call the model method to create a user in the DB
        $user = $this->userModel->create($clean_data);
        echo json_encode($user);
        exit;
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