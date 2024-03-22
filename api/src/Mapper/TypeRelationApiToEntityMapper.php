<?php

namespace App\Mapper;

use App\ApiResource\TypeRelationAPI;
use App\Entity\TypeRelation;
use App\Repository\TypeRelationRepository;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;

#[AsMapper(from: TypeRelationAPI::class, to: TypeRelation::class)]
class TypeRelationApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private TypeRelationRepository $typeRelationRepository
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO typeRelation à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof TypeRelationAPI);

        // Charge l'statut typeRelation existante ou crée une nouvelle instance.
        $statutEntity = $dto->id ? $this->typeRelationRepository->find($dto->id) : new TypeRelation();
        // Si l'entité typeRelation n'existe pas, lance une exception.
        if(!$statutEntity){
            throw new \Exception('Type de relation non trouvé');
        }

        // Retourne l'entité typeRelation.
        return $statutEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO typeRelation à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof TypeRelationAPI);

        // Obtient l'entité typeRelation.
        $entity = $to;
        assert($entity instanceof TypeRelation);

        // Met à jour l'entité typeRelation avec les données du DTO.
        $entity->setLibelle($dto->libelle);

        // Retourne l'entité typeRelation mise à jour.
        return $entity;
    }
}
