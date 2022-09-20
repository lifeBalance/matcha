<?php
class Logout
{
    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $this->refreshTokenModel = new RefreshToken();
    }

    // POST -> /logout: For logging out
    public function create()
    {
        if (isset($_COOKIE['refreshToken'])) {
            $this->refreshTokenModel->delete($_COOKIE['refreshToken']);
            echo json_encode(['refresh' => $_COOKIE]);
            exit;
        }
    }
}