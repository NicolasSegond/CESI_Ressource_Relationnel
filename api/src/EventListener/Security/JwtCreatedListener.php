<?php

namespace App\EventListener\Security;

use App\Entity\User;
use App\Entity\Utilisateur;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\RequestStack;

#[AsEventListener(
    event: 'lexik_jwt_authentication.on_jwt_created',
    method: 'onJWTCreated',
)]
class JwtCreatedListener
{

    public function __construct(
        private RequestStack $requestStack,
    )
    {
    }

    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $utilisateur = $event->getUser();
        assert($utilisateur instanceof Utilisateur);

        $request = $this->requestStack->getCurrentRequest();

        $payload = $event->getData();

        $infoUser = [];

        $infoUser['uri_utilisateur'] = "/api/users/".$utilisateur->getId();
        $infoUser['id'] = $utilisateur->getId();
        $infoUser['email'] = $utilisateur->getEmail();
        $infoUser['roles'] = $utilisateur->getRoles();

        $payload['user'] = $infoUser;


        $event->setData($payload);
    }
}