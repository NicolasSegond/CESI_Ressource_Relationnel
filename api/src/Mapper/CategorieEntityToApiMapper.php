<?php

namespace App\Mapper;

use App\ApiResource\CategorieAPI;
use App\Entity\Categorie;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: Categorie::class, to: CategorieAPI::class)]
class CategorieEntityToApiMapper implements MapperInterface
{
    public function __construct(
        private MicroMapperInterface $microMapper,
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel charger le DTO.
        $entity = $from;
        assert($entity instanceof Categorie);

        // Crée une nouvelle instance de l'API Utilisateur.
        $dto = new CategorieAPI();
        $dto->id = $entity->getId();

        // Retourne l'API Utilisateur
        return $dto;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof Categorie);

        // Obtient le DTO utilisateur à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof CategorieAPI);

        // Remplit les propriétés de l'API Utilisateur avec les valeurs de l'entité Utilisateur.
        $dto->id = $entity->getId();
        $dto->nom = $entity->getNom();

        // Retourne l'API Utilisateur mise à jour.
        return $dto;
    }
}