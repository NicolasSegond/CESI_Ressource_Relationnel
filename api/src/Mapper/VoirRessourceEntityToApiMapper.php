<?php

namespace App\Mapper;

use App\ApiResource\RessourceAPI;
use App\ApiResource\UtilisateurAPI;
use App\ApiResource\VoirRessourceAPI;
use App\Entity\Visibilite;
use App\Entity\VoirRessource;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: VoirRessource::class, to: VoirRessourceAPI::class)]
class VoirRessourceEntityToApiMapper implements MapperInterface
{
    public function __construct(
        private MicroMapperInterface $microMapper,
    ){
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient l'entité VoirRessource à partir duquel charger le DTO.
        $entity = $from;
        assert($entity instanceof VoirRessource);

        // Crée une nouvelle instance de l'API VoirRessource.
        $dto = new VoirRessourceAPI();
        $dto->id = $entity->getId();

        // Retourne l'API VoirRessource
        return $dto;
    }
    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité VoirRessource à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof VoirRessource);

        // Obtient le DTO VoirRessource à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof VoirRessourceAPI);

        // Remplit les propriétés de l'API VoirRessource avec les valeurs de l'entité VoirRessource.
        $dto->id = $entity->getId();

        $dto->utilisateur = $this->microMapper->map($entity->getUtilisateur(), UtilisateurAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]);

        $dto->ressource = $this->microMapper->map($entity->getRessource(), RessourceAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]);

        // Retourne l'API VoirRessource mise à jour.
        return $dto;
    }
}