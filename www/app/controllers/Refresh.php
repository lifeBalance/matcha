<?php
class Refresh
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
    }
}