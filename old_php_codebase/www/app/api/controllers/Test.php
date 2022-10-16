<?php
use PHPMailer\PHPMailer\PHPMailer;

class Test
{
    public function __construct()
    {
        header('Content-Type: application/json; charset=UTF-8');
    }

    // Read (GET): collection or single item.
    public function read($args)
    {
        // Testing that emails are being sent
        // $mail = new Mailer();
        // $mail->send_mail([
        //     'recipient' => 'agrucam@hotmail.com',
        //     'username'      => 'username goes here',
        //     'subject'      => 'subject goes here',
        //     'body'      => 'what ?',
        // ]);
        echo json_encode('Hello world again');
    }
}