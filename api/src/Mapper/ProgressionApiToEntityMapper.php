<?php

namespace App\Mapper;

use App\ApiResource\ProgressionAPI;
use App\Entity\Progression;
use App\Entity\Ressource;
use App\Entity\TypeProgression;
use App\Entity\Utilisateur;
use App\Repository\ProgressionRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: ProgressionAPI::class, to: Progression::class)]
class ProgressionApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private ProgressionRepository $progressionRepository,
        private MicroMapperInterface      $microMapper,
        private PropertyAccessorInterface $propertyAccessor
    ) {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO progression à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof ProgressionAPI);

        // Charge l'entité progression existante ou crée une nouvelle instance.
        $progressionEntity = $dto->id ? $this->progressionRepository->find($dto->id) : new Progression();
        // Si l'entité progression n'existe pas, lance une exception.
        if (!$progressionEntity) {
            throw new \Exception('Progression not found');
        }

        // Retourne l'entité progression.
        return $progressionEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO progression à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof ProgressionAPI);

        // Obtient l'entité progression
        $entity = $to;
        assert($entity instanceof Progression);

        // Met à jour les propriétés de l'entité progression.
        if ($dto->TypeProgression === null) {
            throw new HttpException(400, 'Le type de progression ne peut pas être vide');
        } else {
            $entity->setTypeProgression($this->microMapper->map($dto->TypeProgression, TypeProgression::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        if ($dto->Utilisateur === null) {
            throw new HttpException(400, 'L\'utilisateur ne peut pas être vide');
        } else {
            $entity->setUtilisateur($this->microMapper->map($dto->Utilisateur, Utilisateur::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        if ($dto->Ressource === null) {
            throw new HttpException(400, 'La ressource ne peut pas être vide');
        } else {
            $entity->setRessource($this->microMapper->map($dto->Ressource, Ressource::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        // Retourne l'entité progression mise à jour.
        return $entity;
    }
}
