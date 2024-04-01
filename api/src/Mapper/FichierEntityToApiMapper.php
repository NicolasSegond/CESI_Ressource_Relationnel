<?php

namespace App\Mapper;

use App\ApiResource\FichierAPI;
use App\ApiResource\RessourceAPI;
use App\Entity\Fichier;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: Fichier::class, to: FichierAPI::class)]
class FichierEntityToApiMapper implements MapperInterface
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
        assert($entity instanceof Fichier);

        // Crée une nouvelle instance de l'API VoirRessource.
        $dto = new FichierAPI();
        $dto->id = $entity->getId();

        // Retourne l'API VoirRessource
        return $dto;
    }
    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité VoirRessource à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof Fichier);

        // Obtient le DTO VoirRessource à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof FichierAPI);

        // Remplit les propriétés de l'API VoirRessource avec les valeurs de l'entité VoirRessource.
        $dto->id = $entity->getId();

        $dto->ressource = $this->microMapper->map($entity->getRessource(), RessourceAPI::class);

        $dto->nom = $entity->getNom();

        $dto->taille = $entity->getTaille();

        $dto->creation = $entity->getCreation();

        // Retourne l'API VoirRessource mise à jour.
        return $dto;
    }
}