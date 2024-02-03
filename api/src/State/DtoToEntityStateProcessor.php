<?php

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Doctrine\Common\State\RemoveProcessor;
use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfonycasts\MicroMapper\MicroMapperInterface;

class DtoToEntityStateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: PersistProcessor::class)] private ProcessorInterface $persistProcessor,
        #[Autowire(service: RemoveProcessor::class)] private ProcessorInterface $removeProcessor,
        private MicroMapperInterface $microMapper
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du processeur.
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // Obtient les options d'état de l'opération en cours.
        $stateOptions = $operation->getStateOptions();
        assert($stateOptions instanceof Options);

        // Récupère la classe de l'entité correspondante.
        $entityClass = $stateOptions->getEntityClass();

        // Mappe l'objet DTO vers une entité Doctrine.
        $entity = $this->mapDtoToEntity($data, $entityClass);

        // Utilise le processeur de suppression si l'opération est une suppression.
        if ($operation instanceof DeleteOperationInterface) {
            $this->removeProcessor->process($entity, $operation, $uriVariables, $context);

            return null;
        }

        // Sinon, utilise le processeur de persistance
        $this->persistProcessor->process($entity, $operation, $uriVariables, $context);
        $data->id = $entity->getId();

        // Retourne les données transformées.
        return $data;
    }

    private function mapDtoToEntity(object $dto, string $entityClass): object
    {
        // Utilise le service MicroMapper pour copier les propriétés de l'objet DTO
        // vers une nouvelle instance de l'entité cible.
        return $this->microMapper->map($dto, $entityClass);
    }
}