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
        // Générer un code aléatoire
        $this->generatedCode = mt_rand(100000, 999999); // Génère un code à 6 chiffres

        $object = $event->getObject();
        if ($object instanceof Utilisateur && !$object->getId()) {
            $object->setCode($this->generatedCode);
        }
    }

    public function getGeneratedCode(): ?int
    {
        return $this->generatedCode;
    }
}
