<?php

namespace App\Mapper;

use App\ApiResource\VisibiliteAPI;
use App\Entity\Visibilite;
use App\Repository\VisibiliteRepository;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;

#[AsMapper(from: VisibiliteAPI::class, to: Visibilite::class)]
class VisibiliteApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private VisibiliteRepository $visibiliteRepository
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO visibilite à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof VisibiliteAPI);

        // Charge l'statut visibilite existante ou crée une nouvelle instance.
        $statutEntity = $dto->id ? $this->visibiliteRepository->find($dto->id) : new Visibilite();
        // Si l'entité visibilite n'existe pas, lance une exception.
        if(!$statutEntity){
            throw new \Exception('Visibilité non trouvé');
        }

        // Retourne l'entité visibilite.
        return $statutEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO Visibilite à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof VisibiliteAPI);

        // Obtient l'entité Visibilite.
        $entity = $to;
        assert($entity instanceof Visibilite);

        // Met à jour l'entité Visibilite avec les données du DTO.
        $entity->setLibelle($dto->libelle);

        // Retourne l'entité Visibilite mise à jour.
        return $entity;
    }
}
