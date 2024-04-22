<?php

namespace App\Mapper;

use App\ApiResource\CommentaireAPI;
use App\ApiResource\UtilisateurAPI;
use App\Entity\Commentaire;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: Commentaire::class, to: CommentaireAPI::class)]
class CommentaireEntityToApiMapper implements MapperInterface
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
        assert($entity instanceof Commentaire);

        // Crée une nouvelle instance de l'API Utilisateur.
        $dto = new CommentaireAPI();
        $dto->id = $entity->getId();

        // Retourne l'API Utilisateur
        return $dto;
    }
    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité utilisateur à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof Commentaire);

        // Obtient le DTO utilisateur à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof CommentaireAPI);

        // Remplit les propriétés de l'API Utilisateur avec les valeurs de l'entité Utilisateur.
        $dto->id = $entity->getId();
        $dto->contenu = $entity->getContenu();
        $dto->date = $entity->getDate();
        $dto->utilisateur = $this->microMapper->map($entity->getUtilisateur(), UtilisateurAPI::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]);

        // Retourne l'API Utilisateur mise à jour.
        return $dto;
    }
}
