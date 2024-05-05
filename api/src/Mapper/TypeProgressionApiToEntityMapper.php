<?php

namespace App\Mapper;

use App\ApiResource\TypeProgressionAPI;
use App\Entity\TypeProgression;
use App\Repository\TypeProgressionRepository;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: TypeProgressionAPI::class, to: TypeProgression::class)]
class TypeProgressionApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private TypeProgressionRepository $typeProgressionRepository,
        private MicroMapperInterface      $microMapper,
        private PropertyAccessorInterface $propertyAccessor
    ) {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO typeProgression à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof TypeProgressionAPI);

        // Charge l'entité typeProgression existante ou crée une nouvelle instance.
        $typeProgression = $dto->id ? $this->typeProgressionRepository->find($dto->id) : new TypeProgression();
        // Si l'entité typeProgression n'existe pas, lance une exception.
        if (!$typeProgression) {
            throw new \Exception('typeProgression not found');
        }

        // Retourne l'entité typeProgression.
        return $typeProgression;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO typeProgression à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof TypeProgressionAPI);

        // Obtient l'entité typeProgression
        $entity = $to;
        assert($entity instanceof TypeProgression);

        // Met à jour les propriétés de l'entité typeProgression.
        $entity->setLibelle($dto->libelle);

        // Retourne l'entité typeProgression mise à jour.
        return $entity;
    }
}
