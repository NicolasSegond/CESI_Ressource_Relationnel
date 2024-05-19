<?php

namespace App\EventListener\Progression;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\ApiResource\ProgressionAPI;
use App\Entity\Progression;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\KernelEvents;

class ProgressionListener implements EventSubscriberInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['prePersist', EventPriorities::PRE_WRITE],
        ];
    }

    public function prePersist(ViewEvent $event): void
    {
        $entity = $event->getControllerResult();
        $request = $event->getRequest();

        // Vérifie le type de requête HTTP
        if ($request->getMethod() === Request::METHOD_DELETE) {
            // Ne pas effectuer de vérification pour l'opération DELETE
            return;
        }

        if (!$entity instanceof ProgressionAPI) {
            return;
        }

        $typeProgressionId = $entity->TypeProgression ? $entity->TypeProgression->id : null;
        $utilisateurId = $entity->Utilisateur ? $entity->Utilisateur->id : null;
        $ressourceId = $entity->Ressource ? $entity->Ressource->id : null;

        $existingProgression = $this->entityManager->getRepository(Progression::class)->findOneBy([
            'TypeProgression' => $typeProgressionId,
            'Utilisateur' => $utilisateurId,
            'Ressource' => $ressourceId,
        ]);

        if ($existingProgression !== null) {
            throw new HttpException(400, 'Vous avez déjà mis en favoris ou mis de côté cette ressource.');
        }
    }
}
