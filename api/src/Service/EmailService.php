<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    private $mailer;

    public function __construct(
        MailerInterface $mailer,
    )
    {
        $this->mailer = $mailer;
    }

    public function sendEmail(string $emailTo, string $subject, string $body): void
    {
        $message = (new Email())
            ->from('ressourcerelationnel@gmail.com')
            ->to($emailTo)
            ->subject($subject)
            ->html($body);


        $this->mailer->send($message);
    }
}