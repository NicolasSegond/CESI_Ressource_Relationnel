<?php

namespace App\Mapper;

use App\ApiResource\TypeDeRessourceAPI;
use App\Entity\TypeDeRessource;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: TypeDeRessource::class, to: TypeDeRessourceAPI::class)]
class TypeDeRessourceEntityToApiMapper implements MapperInterface
{
    public function __construct(
        private MicroMapperInterface $microMapper,
    ){
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient l'entité TypeDeRessource à partir duquel charger le DTO.
        $entity = $from;
        assert($entity instanceof TypeDeRessource);
        // Crée une nouvelle instance de l'API TypeDeRessource.
        $dto = new TypeDeRessourceAPI();
        $dto->id = $entity->getId();
        // Retourne l'API TypeDeRessource
        return $dto;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient l'entité TypeDeRessource à partir duquel mettre à jour le DTO.
        $entity = $from;
        assert($entity instanceof TypeDeRessource);
        // Obtient le DTO TypeDeRessource à partir duquel mettre à jour l'entité.
        $dto = $to;
        assert($dto instanceof TypeDeRessourceAPI);
        // Remplit les propriétés de l'API TypeDeRessource avec les valeurs de l'entité TypeDeRessource.
        $dto->id = $entity->getId();
        $dto->libelle = $entity->getLibelle();
        // Retourne l'API TypeDeRessource mise à jour.
        return $dto;
    }
}
