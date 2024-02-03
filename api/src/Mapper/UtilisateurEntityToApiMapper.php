<?php

namespace App\Mapper;

use App\ApiResource\FilesAPI;
use App\ApiResource\UserAPI;
use App\ApiResource\UtilisateurAPI;
use App\Entity\Files;
use App\Entity\User;
use App\Entity\Utilisateur;
use Doctrine\Common\Collections\Collection;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: Utilisateur::class, to: UtilisateurAPI::class)]
class UtilisateurEntityToApiMapper implements MapperInterface
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
        assert($entity instanceof Utilisateur);

        // Crée une nouvelle instance de l'API Utilisateur.
        $dto = new UtilisateurAPI();
        $dto->id = $entity->getId();

        // Retourne l'API Utilisateur
        return $dto;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof Utilisateur);

        // Obtient le DTO utilisateur à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof UtilisateurAPI);

        // Remplit les propriétés de l'API Utilisateur avec les valeurs de l'entité Utilisateur.
        $dto->id = $entity->getId();
        $dto->nom = $entity->getNom();
        $dto->prenom = $entity->getPrenom();
        $dto->email = $entity->getEmail();
        $dto->password = $entity->getPassword();
        $dto->roles = $entity->getRoles();
        $dto->code = $entity->getCode();
        $dto->verif = $entity->getVerif();

        // Retourne l'API Utilisateur mise à jour.
        return $dto;
    }
}