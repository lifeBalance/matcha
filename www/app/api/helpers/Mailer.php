<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    public function __construct()
    {
        // Create an instance; passing `true` enables exceptions
        $this->mail = new PHPMailer(true);
    }

    public function send_mail(Array $data = null)
    {
        try {
            //Server settings
            $this->mail->SMTPDebug = 0; // For production
            // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER; //Enable verbose debug output
            $this->mail->isSMTP();                                            //Send using SMTP
            /* Disable some SSL checks. */
            $this->mail->SMTPOptions = array(
                'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
                )
            );
            $this->mail->Host       = 'smtp.gmail.com';
            $this->mail->SMTPAuth   = true;
            $this->mail->Username   = MAIL_FROM; // defined in settings.php
            $this->mail->Password   = MAIL_PWD;
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $this->mail->Port       = 465;// Use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS` (465 otherwise)
        
            //Recipients
            $this->mail->setFrom(MAIL_FROM, 'Mailer');
            $this->mail->addAddress($data['recipient'], $data['username']);

            //Content
            $this->mail->isHTML(true);
            $this->mail->Subject = $data['subject'];
            $this->mail->Body    = $data['body'];
        
            $this->mail->send();
            // echo 'Message has been sent';    // Testing
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$this->mail->ErrorInfo}";
        }
    }
}