<?php
class Test
{
    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
    }

    // Read (GET): collection or single item.
    public function read($args)
    {
        echo json_encode('Hello world');
    }
}