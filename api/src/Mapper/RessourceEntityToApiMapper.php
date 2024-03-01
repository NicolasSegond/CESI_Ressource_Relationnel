<?php

namespace App\Mapper;

use App\ApiResource\CategorieAPI;
use App\ApiResource\RessourceAPI;
use App\ApiResource\StatutAPI;
use App\ApiResource\TypeDeRessourceAPI;
use App\ApiResource\TypeRelationAPI;
use App\ApiResource\UtilisateurAPI;
use App\ApiResource\VisibiliteAPI;
use App\Entity\Ressource;
use App\Entity\VoirRessource;
use Doctrine\DBAL\Types\Type;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;
#[AsMapper(from: Ressource::class, to: RessourceAPI::class)]
class RessourceEntityToApiMapper implements MapperInterface
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
        assert($entity instanceof Ressource);

        // Crée une nouvelle instance de l'API Utilisateur.
        $dto = new RessourceAPI();
        $dto->id = $entity->getId();

        // Retourne l'API Utilisateur
        return $dto;
    }
    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof Ressource);

        // Obtient le DTO utilisateur à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof RessourceAPI);

        // Remplit les propriétés de l'API Utilisateur avec les valeurs de l'entité Utilisateur.
        $dto->id = $entity->getId();
        $dto->titre = $entity->getTitre();
        $dto->contenu = $entity->getContenu();
        $dto->dateCreation = $entity->getDateCreation();
        $dto->dateModification = $entity->getDateModification();
        $dto->nombreVue = $entity->getNombreVue();

        $dto->proprietaire = $this->microMapper->map($entity->getProprietaire(), UtilisateurAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        $dto->statut = $this->microMapper->map($entity->getStatut(), StatutAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        $dto->visibilite = $this->microMapper->map($entity->getVisibilite(), VisibiliteAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        $dto->typeDeRessource = $this->microMapper->map($entity->getTypeDeRessource(), TypeDeRessourceAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        $dto->typeRelation = $this->microMapper->map($entity->getTypeRelation(), TypeRelationAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        $dto->typeRelation = $this->microMapper->map($entity->getTypeRelation(), TypeRelationAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        $dto->categorie = $this->microMapper->map($entity->getCategorie(), CategorieAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]);

        // Retourne l'API Utilisateur mise à jour.
        return $dto;
    }
}