<?php

namespace App\EventListener\Vue;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\ApiResource\RessourceAPI;
use App\Entity\Ressource;
use App\Repository\RessourceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class VueListener implements EventSubscriberInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager, RessourceRepository $ressourceRepository)
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

        // Vérifie si la requête est un GET et si l'entité est de type Ressource
        if ($request->getMethod() !== Request::METHOD_GET || !$entity instanceof RessourceAPI) {
            return;
        }

        $entity = $this->entityManager->getRepository(Ressource::class)->findOneBy(['id' => $entity->id]);

        // Incrémenter le nombre de vues
        $entity->setNombreVue($entity->getNombreVue() + 1);

        // Persister la mise à jour dans la base de données
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
    }
}
