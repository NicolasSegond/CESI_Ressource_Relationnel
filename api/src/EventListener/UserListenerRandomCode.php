<?php


namespace App\EventListener;

use App\ApiResource\UtilisateurAPI;
use App\Entity\Utilisateur;
use Doctrine\Persistence\Event\LifecycleEventArgs;
class UserListenerRandomCode
{
    private $generatedCode;
    private $generatedToken;

    public function prePersist(LifecycleEventArgs $event): void
    {
        $object = $event->getObject();
        if ($object instanceof Utilisateur && !$object->getId()) {
            $this->generatedCode = mt_rand(100000, 999999); // Génère un code à 6 chiffres
            $object->setCode($this->generatedCode);
            $this->generatedToken = bin2hex(random_bytes(100 / 2)); // Convertir en chaîne hexadécimale
            $object->setTokenVerif($this->generatedToken);
        }
    }
    public function getGeneratedCode(): ?int
    {
        return $this->generatedCode;
    }
    public function getGeneratedToken(): ?string
    {
        return $this->generatedToken;
    }
}
