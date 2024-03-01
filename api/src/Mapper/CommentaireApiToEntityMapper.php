<?php

namespace App\Mapper;

use App\ApiResource\CommentaireAPI;
use App\Entity\Commentaire;
use App\Repository\CommentaireRepository;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;

#[AsMapper(from: CommentaireAPI::class, to: Commentaire::class)]
class CommentaireApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private CommentaireRepository $commentaireRepository
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO commentaire à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof CommentaireAPI);

        // Charge l'entité commentaire existante ou crée une nouvelle instance.
        $commentaireEntity = $dto->id ? $this->commentaireRepository->find($dto->id) : new Commentaire();
        // Si l'entité commentaire n'existe pas, lance une exception.
        if(!$commentaireEntity){
            throw new \Exception('Commentaire non trouvé');
        }

        // Retourne l'entité categorie.
        return $commentaireEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO commentaire à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof CommentaireAPI);

        // Obtient l'entité commentaire
        $entity = $to;
        assert($entity instanceof Commentaire);

        $entity->setDate($dto->date);
        $entity->setContenu($dto->contenu);

        // Retourne l'entité utilisateur mise à jour.
        return $entity;
    }
}