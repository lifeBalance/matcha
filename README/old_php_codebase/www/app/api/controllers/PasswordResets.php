<?php

class PasswordResets
{
    private $userModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
    }

    // Create (POST -> /api/confirm): For requesting a password reset
    public function create()
    {
        $data = json_decode(file_get_contents('php://input'));
        // echo json_encode($data); exit;

        $user = $this->userModel->getByEmail($data->email);
        // If there's no user with such email
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'That email is not in our DB']);
            exit;
        }

        // If the user account is already confirmed
        // if ($user->confirmed) {
        //     http_response_code(401);
        //     echo json_encode(['error' => 'already confirmed']);
        //     exit;
        // }

        // Instantiate the EmailToken model (we're gonna hit that table)
        $emailTokenModel = new EmailToken();

        // Delete old token (if any) before trying to write a new one to the DB
        $emailTokenModel->deleteByEmail($user->email);

        // Generate Email Token (password resetting)
        $email_token = bin2hex(random_bytes(16)); // 32 chars

        // Create the Email token in the 'email_tokens' table
        $createdToken = $emailTokenModel->create(
            $user->email, $email_token, time() + EMAIL_TOKEN_EXP);
        if ($createdToken) {
            $user_data = [
                'email'         => $user->email,
                'firstname'     => $user->firstname
            ];
            // echo json_encode([
            //     'user'=>$user->firstname,
            //     'token'=> $createdToken->email_token]);
            // exit;
            $this->sendMail($user_data, $createdToken->email_token);
        }
        exit();
    }

    // Update (PUT): For resetting the password
    public function update()
    {
        // Account info is sent as raw JSON data in a PUT request.
        $data = json_decode(file_get_contents('php://input'));
        $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
        $token  = filter_var($data->token, FILTER_SANITIZE_SPECIAL_CHARS);
        $pwd  = filter_var($data->password, FILTER_SANITIZE_SPECIAL_CHARS);
        $pwd_conf = filter_var($data->pwdConf, FILTER_SANITIZE_SPECIAL_CHARS);
        if ($pwd !== $pwd_conf ||
            strlen($pwd) > 255 ||
            strlen($pwd_conf) > 255)
        {
            http_response_code(401);
            echo json_encode(['error' => 'something went wrong']);
            exit;
        }

        $user = $this->userModel->getByEmail($email);
        // If there's no user with such email (fake confirmation link)
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'something went wrong']);
            exit;
        }

        $emailTokenModel = new EmailToken();
        $emailToken = $emailTokenModel->getByEmail($email);
        // echo json_encode([
            //     'email'=>$user->email,
            //     'email token'=>$emailToken
            // ]);
            // exit; // testing

        // If there's no token in the DB, or it's different (fake link or old token)
        if (!$emailToken || $emailToken->email_token !== $token) {
            http_response_code(401);
            echo json_encode(['error' => 'invalid token']);
            exit;
        }

        if ($emailToken->expires_at < time()) {
            http_response_code(401);
            echo json_encode(['error' => 'token expired']);
            exit;
        }

        // Delete old token (expired or not)
        $emailTokenModel->deleteByEmail($user->email);

        // All is good: Proceed to update the user's password!
        // echo json_encode(['success' => 'token woot']);
        $ret = $this->userModel->updatePassword($email, $pwd);

        echo json_encode(['message' => 'password updated']);
    }

    // Send the Password reset mail
    private function sendMail(Array $user, String $email_token)
    {

        $mail = new Mailer();
        $mail->send_mail([
            'recipient' => $user['email'],
            'username'  => $user['firstname'],
            'subject'   => 'Reset your Matcha Password',
            'body'      =>
                "<h1>Lots of things in your head, huh?</h1>
                <p>Please, click <a href=\"https://localhost/reset/{$user['email']}/{$email_token}\" >here</a> to reset your password!</p>"
        ]);
    }
}