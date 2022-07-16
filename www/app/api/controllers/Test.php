<?php
class Test
{
    // CREATE.
    public function create($args)
    {
        echo json_encode("new test has been created");
    }

    // READ: collection.
    public function index($args)
    {
        echo json_encode([
            "1" => "first one",
            "2" => "second one",
        ]);
    }

    // READ: one.
    public function show($args)
    {
        $id = $args['id'];
        // $headers = getallheaders();
        // if (isset($headers["Content-Type"]) &&
        //     $headers["Content-Type"] === 'application/x-www-form-urlencoded') {
        //     echo $headers["Content-Type"];
        //     echo json_encode("id: $id");
        //     $id = $args['id'];
        // } else {
        //     http_response_code(404);
        //     die();
        // }
        echo json_encode("id: $id");
    }

    // UPDATE.
    public function update($args)
    {
        $id = $args['id'];
        echo json_encode("test $id has been updated");
    }

    // DELETE.
    public function delete($args)
    {
        $id = $args['id'];
        echo json_encode("test $id has been deleted");
    }
}