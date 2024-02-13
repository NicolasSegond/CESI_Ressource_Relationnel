<?php
// src/EventListener/UserCreationListener.php
namespace App\EventListener;

use App\Entity\Utilisateur;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class UserCreationListener
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function postPersist(Utilisateur $user, LifecycleEventArgs $args)
    {
        // Envoyer un e-mail ici
        $email = (new Email())
            ->from('ressourcerelationnel@gmail.com')
            ->to("mathiscolbaut@gmail.com")
            ->subject('Bienvenue')
            ->text('Bienvenue sur notre plateforme !');

        $this->mailer->send($email);
    }
}
