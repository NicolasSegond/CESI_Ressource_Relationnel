<?php

namespace App\Mapper;

use App\ApiResource\CategorieAPI;
use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: CategorieAPI::class, to: Categorie::class)]
class CategorieApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private CategorieRepository       $categorieRepository,
        private MicroMapperInterface      $microMapper,
        private PropertyAccessorInterface $propertyAccessor
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO categorie à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof CategorieAPI);

        // Vérifie si le nom de la catégorie existe déjà dans la base de données.
        $requestMethod = $_SERVER['REQUEST_METHOD'] ?? null;

        if ($requestMethod === 'POST') {
            // Vérifie si le nom de la catégorie existe déjà dans la base de données.
            $existingCategorie = $this->categorieRepository->findOneBy(['nom' => $dto->nom]);

            // Si une catégorie avec ce nom existe déjà, lance une exception.
            if ($existingCategorie) {
                throw new HttpException(500, 'Ce nom de catégorie est déjà utilisé.');
            }
        }

        // Charge l'entité categorie existante ou crée une nouvelle instance.
        $categorieEntity = $dto->id ? $this->categorieRepository->find($dto->id) : new Categorie();
        // Si l'entité categorie n'existe pas, lance une exception.
        if (!$categorieEntity) {
            throw new \Exception('Catégorie not found');
        }

        // Retourne l'entité categorie.
        return $categorieEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO categorie à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof CategorieAPI);

        // Obtient l'entité categorie
        $entity = $to;
        assert($entity instanceof Categorie);

        $entity->setNom($dto->nom);

        // Retourne l'entité utilisateur mise à jour.
        return $entity;
    }
}
