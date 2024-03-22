<?php

namespace App\Mapper;

use App\ApiResource\TypeProgressionAPI;
use App\Entity\TypeProgression;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: TypeProgression::class, to: TypeProgressionAPI::class)]
class TypeProgressionEntityToApiMapper implements MapperInterface
{
    public function __construct(
        private MicroMapperInterface $microMapper,
    ){
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel charger le DTO.
        $entity = $from;
        assert($entity instanceof TypeProgression);

        // Crée une nouvelle instance de l'API Utilisateur.
        $dto = new TypeProgressionAPI();
        $dto->id = $entity->getId();

        // Retourne l'API Utilisateur
        return $dto;
    }
    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof TypeProgression);

        // Obtient le DTO utilisateur à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof TypeProgressionAPI);

        // Remplit les propriétés de l'API Utilisateur avec les valeurs de l'entité Utilisateur.
        $dto->id = $entity->getId();
        $dto->libelle = $entity->getLibelle();

        // Retourne l'API Utilisateur mise à jour.
        return $dto;
    }
}