<?php

class ProfilePics
{
    private $profileModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        // header('Content-Type: application/json; charset=UTF-8');

        $this->profileModel = new Profile();
    }

    // Authorize request
    // private function authorize()
    // {
    //     try {
    //         return Auth::authorize($_SERVER['HTTP_AUTHORIZATION']);
    //     } catch (ExpiredTokenException) {
    //         http_response_code(401); // Unauthorized
    //         echo json_encode(['error' => 'Invalid token error']);
    //         die;
    //     } catch (Exception $e) {
    //         http_response_code(400); // Bad Request
    //         header('Location: /404', TRUE, 301);exit; // Travolta takes it from here
    //         echo json_encode(['error' => $e->getMessage()]);
    //         die;
    //     }
    // }

    public function read()
    {
        // Extract the User ID from the token in the Authorization Header.
        $uid =  Auth::getUidFromToken($_SERVER['HTTP_AUTHORIZATION']);

        $pdoObj = $this->profileModel->getProfilePic($uid);
        echo json_encode(['profilePic' => $pdoObj->profile_pic]);
    }
}