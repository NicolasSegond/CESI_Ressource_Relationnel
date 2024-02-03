<?php

namespace App\State;

use ApiPlatform\Doctrine\Orm\State\ItemProvider;
use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\Doctrine\Orm\State\CollectionProvider;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfonycasts\MicroMapper\MicroMapperInterface;

class EntityToDtoStateProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire(service: CollectionProvider::class)] private ProviderInterface $collectionProvider,
        #[Autowire(service: ItemProvider::class)] private ProviderInterface $itemProvider,
        private MicroMapperInterface $microMapper
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du fournisseur d'état.
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // Obtient la classe de la ressource en cours.
        $resourceClass = $operation->getClass();

        // Si l'opération est une collection, récupère les entités avec le fournisseur de collection.
        if ($operation instanceof CollectionOperationInterface) {
            $entities = $this->collectionProvider->provide($operation, $uriVariables, $context);
            assert($entities instanceof Paginator);

            // Mappe chaque entité vers son équivalent DTO.
            $dtos = [];
            foreach ($entities as $entity) {
                $dtos[] = $this->mapEntityToDto($entity, $resourceClass);
            }

            // Retourne un Paginator contenant les DTOs.
            return new TraversablePaginator(
                new \ArrayIterator($dtos),
                $entities->getCurrentPage(),
                $entities->getItemsPerPage(),
                $entities->getTotalItems()
            );
        }

        // Si l'opération n'est pas une collection, récupère une entité individuelle avec le fournisseur d'élément.
        $entity = $this->itemProvider->provide($operation, $uriVariables, $context);

        if (!$entity) {
            return null;
        }

        // Mappe l'entité vers son équivalent DTO et le retourne.
        return $this->mapEntityToDto($entity, $resourceClass);
    }

    private function mapEntityToDto(object $entity, string $resourceClass): object
    {
        // Utilise le service MicroMapper pour copier les propriétés de l'entité vers une nouvelle instance de DTO.
        return $this->microMapper->map($entity, $resourceClass);
    }
}