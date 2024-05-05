<?php

namespace App\Mapper;

use App\ApiResource\ProgressionAPI;
use App\ApiResource\RessourceAPI;
use App\ApiResource\TypeProgressionAPI;
use App\ApiResource\UtilisateurAPI;
use App\Entity\Progression;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: Progression::class, to: ProgressionAPI::class)]
class ProgressionEntityToApiMapper implements MapperInterface
{
    public function __construct(
        private MicroMapperInterface $microMapper,
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient l'entité Progression à partir duquel charger le DTO.
        $entity = $from;
        assert($entity instanceof Progression);

        // Crée une nouvelle instance de l'API Progression.
        $dto = new ProgressionAPI();
        $dto->id = $entity->getId();

        // Retourne l'API Progression
        return $dto;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité Progression à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof Progression);

        // Obtient le DTO Progression à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof ProgressionAPI);

        // Remplit les propriétés de l'API Progression avec les valeurs de l'entité Utilisateur.
        $dto->id = $entity->getId();

        $dto->TypeProgression = $this->microMapper->map($entity->getTypeProgression(), TypeProgressionAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]);

        $dto->Utilisateur = $this->microMapper->map($entity->getUtilisateur(), UtilisateurAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]);

        $dto->Ressource = $this->microMapper->map($entity->getRessource(), RessourceAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]);

        // Retourne l'API Progression mise à jour.
        return $dto;
    }
}