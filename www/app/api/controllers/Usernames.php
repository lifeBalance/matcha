<?php

class Usernames
{
    private $userModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
    }

    // Create (POST -> /api/usernames): For checking if a username exists
    public function create()
    {
        $data = json_decode(file_get_contents('php://input'));

        $user = $this->userModel->getByUsername($data->username);

        $exists = $user ? true : false;
            echo json_encode($exists);
        exit();
    }
}