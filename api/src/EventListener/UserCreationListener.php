<?php
// src/EventListener/UserCreationListener.php
namespace App\EventListener;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Utilisateur;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final class UserCreationListener implements EventSubscriberInterface
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function postPersist(ViewEvent $event)
    {
        $email = (new Email())
            ->from('ressourcerelationnel@gmail.com')
            ->to("nicolassegond0@gmail.com")
            ->subject('Bienvenue')
            ->text('Bienvenue sur notre plateforme !');

        $this->mailer->send($email);
    }

    public static function getSubscribedEvents()
    {
         return [KernelEvents::VIEW => ['postPersist', EventPriorities::POST_WRITE]];
    }
}
