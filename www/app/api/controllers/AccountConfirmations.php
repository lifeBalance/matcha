<?php

class AccountConfirmations
{
    private $userModel;

    public function __construct()
    {
        set_exception_handler('ExceptionHandler::handleException');
        set_error_handler('ErrorHandler::handleError');
        header('Content-Type: application/json; charset=UTF-8');

        $this->userModel = new User();
    }

    // Create (POST -> /api/confirm): For requesting a confirmation email
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
        if ($user->confirmed) {
            http_response_code(401);
            echo json_encode(['error' => 'already confirmed']);
            exit;
        }

        // Instantiate the EmailToken model (we're gonna hit that table)
        $emailTokenModel = new EmailToken();

        // Delete old token (if any) before trying to write a new one to the DB
        $emailTokenModel->deleteByEmail($user->email);

        // Generate Email Token (account confirmation and password resetting)
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

    // Update (PUT): For confirming the account
    public function update()
    {
        // Account info is sent as raw JSON data in a PUT request.
        $data = json_decode(file_get_contents('php://input'));

        $user = $this->userModel->getByEmail($data->email);

        // If there's no user with such email (fake confirmation link)
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'something went wrong']);
            exit;
        }

        $emailTokenModel = new EmailToken();
        $emailToken = $emailTokenModel->getByEmail($user->email);
        // echo json_encode([
            //     'email'=>$user->email,
            //     'email token'=>$emailToken
            // ]);
            // exit; // testing

        // If there's no token in the DB, or it's different (fake link or old token)
        if (!$emailToken || $emailToken->email_token !== $data->token) {
            http_response_code(401);
            echo json_encode(['error' => 'invalid token']);
            exit;
        }

        // If the user account is already confirmed
        if ($user->confirmed) {
            http_response_code(401);
            echo json_encode(['error' => 'already confirmed']);
            exit;
        }

        if ($emailToken->expires_at < time()) {
            http_response_code(401);
            echo json_encode(['error' => 'token expired']);
            exit;
        }
        // All is good: Proceed to confirm the account!
        // echo json_encode(['success' => 'token woot']);
        $ret = $this->userModel->confirmAccount($user->id);
        $emailTokenModel->deleteByEmail($user->email);
        echo json_encode([
            'success' => 'account confirmed',
            'ret' => $ret
        ]);
    }

    // Send the Account confirmation mail
    private function sendMail(Array $user, String $email_token)
    {

        $mail = new Mailer();
        $mail->send_mail([
            'recipient' => $user['email'],
            'username'  => $user['firstname'],
            'subject'   => 'Confirm your Matcha account',
            'body'      =>
                "<h1>Welcome to Matcha</h1>
                <p>Please, click <a href=\"https://localhost/confirm/{$user['email']}/{$email_token}\" >here</a> to get the party started!</p>"
        ]);
    }
}