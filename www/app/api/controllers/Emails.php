<?php

class Emails
{
    private $userModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
    }

    // Create (POST -> /api/emails): For checking if an email exists
    public function create()
    {
        $data = json_decode(file_get_contents('php://input'));

        $user = $this->userModel->getByEmail($data->email);

        $exists = $user ? true : false;
            echo json_encode($exists);
        exit();
    }
}