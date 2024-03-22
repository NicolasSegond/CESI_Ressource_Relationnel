<?php

namespace App\Mapper;

use App\ApiResource\TypeDeRessourceAPI;
use App\Entity\TypeDeRessource;
use App\Repository\TypeDeRessourceRepository;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;

#[AsMapper(from: TypeDeRessourceAPI::class, to: TypeDeRessource::class)]
class TypeDeRessourceApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private TypeDeRessourceRepository $typeDeRessourceRepository
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO typeDeRessource à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof TypeDeRessourceAPI);

        // Charge l'statut typeDeRessource existante ou crée une nouvelle instance.
        $statutEntity = $dto->id ? $this->typeDeRessourceRepository->find($dto->id) : new TypeDeRessource();
        // Si l'entité typeDeRessource n'existe pas, lance une exception.
        if(!$statutEntity){
            throw new \Exception('Type de ressource non trouvé');
        }

        // Retourne l'entité typeDeRessource.
        return $statutEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO typeDeRessource à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof TypeDeRessourceAPI);

        // Obtient l'entité typeDeRessource.
        $entity = $to;
        assert($entity instanceof TypeDeRessource);

        // Met à jour l'entité typeDeRessource avec les données du DTO.
        $entity->setLibelle($dto->libelle);

        // Retourne l'entité typeDeRessource mise à jour.
        return $entity;
    }
}
