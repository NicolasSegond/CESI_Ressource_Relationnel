<?php
namespace App\Mapper;

use App\ApiResource\TypeRelationAPI;
use App\Entity\TypeRelation;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: TypeRelation::class, to: TypeRelationAPI::class)]
class TypeRelationEntityToApiMapper implements MapperInterface
{
    public function __construct(
        private MicroMapperInterface $microMapper,
    ){
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient l'entité TypeRelation à partir duquel charger le DTO.
        $entity = $from;
        assert($entity instanceof TypeRelation);

        // Crée une nouvelle instance de l'API TypeRelation et mappe les données.
        $dto = new TypeRelationAPI();
        $dto->id = $entity->getId();

        // Retourne l'API TypeRelation
        return $dto;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité TypeRelation à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof TypeRelation);

        // Obtient le DTO TypeRelation à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof TypeRelationAPI);

        // Remplit les propriétés de l'API TypeRelation avec les valeurs de l'entité TypeRelation.
        $dto->id = $entity->getId();
        $dto->libelle = $entity->getLibelle();

        // Retourne l'API TypeRelation mise à jour.
        return $dto;
    }
}
