<?php

namespace App\Mapper;

use App\ApiResource\StatutAPI;
use App\Entity\Statut;
use App\Repository\StatutRepository;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;

#[AsMapper(from: StatutAPI::class, to: Statut::class)]
class StatutApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private StatutRepository $statutRepository
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO statut à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof StatutAPI);

        // Charge l'statut statut existante ou crée une nouvelle instance.
        $statutEntity = $dto->id ? $this->statutRepository->find($dto->id) : new Statut();
        // Si l'entité statut n'existe pas, lance une exception.
        if(!$statutEntity){
            throw new \Exception('Statut non trouvé');
        }

        // Retourne l'entité statut.
        return $statutEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO statut à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof StatutAPI);

        // Obtient l'entité statut
        $entity = $to;
        assert($entity instanceof Statut);

        $entity->setNomStatut($dto->nomStatut);

        // Retourne l'entité statut mise à jour.
        return $entity;
    }
}