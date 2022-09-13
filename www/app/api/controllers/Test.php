<?php
class Test
{
    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
    }

    // Read (GET): collection.
    public function index($args)
    {
        echo json_encode('Hello world');
    }
}