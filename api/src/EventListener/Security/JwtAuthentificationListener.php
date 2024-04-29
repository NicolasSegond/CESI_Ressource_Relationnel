<?php

namespace App\EventListener\Security;

use App\Entity\Utilisateur;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Exception\HttpException;

#[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success', method: 'onJWTAuthenticationSuccess')]
class JwtAuthentificationListener
{
    public function onJWTAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $user = $event->getUser();

        // Vérifier si l'utilisateur est une instance de Utilisateur
        if (!$user instanceof Utilisateur) {
            throw new \InvalidArgumentException('Utilisateur invalide.');
        }

        // Vérifier le statut de vérification de l'utilisateur
        switch ($user->getVerif()) {
            case 0:
                throw new HttpException(401, 'Votre compte n\'est pas encore vérifié.');
            case 2:
                throw new HttpException(401, 'Votre compte a été bloqué.');
        }
    }
}
