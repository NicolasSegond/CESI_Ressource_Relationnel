<?php


namespace App\EventListener;

use App\ApiResource\UtilisateurAPI;
use App\Entity\Utilisateur;
use Doctrine\Persistence\Event\LifecycleEventArgs;
class UserListenerRandomCode
{
    private $generatedCode;

    public function prePersist(LifecycleEventArgs $event): void
    {
        $object = $event->getObject();
        if ($object instanceof Utilisateur && !$object->getId()) {
            $this->generatedCode = mt_rand(100000, 999999); // Génère un code à 6 chiffres
            $object->setCode($this->generatedCode);

            // Générer un token de 100 caractères
            $tokenLength = 100;
            $token = bin2hex(random_bytes($tokenLength / 2)); // Convertir en chaîne hexadécimale
            // Assigner le token généré à l'objet Utilisateur
            $object->setTokenVerif($token);
        }
    }

    public function getGeneratedCode(): ?int
    {
        return $this->generatedCode;
    }
}
