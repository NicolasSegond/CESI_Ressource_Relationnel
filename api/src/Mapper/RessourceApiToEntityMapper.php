<?php

namespace App\Mapper;

use App\ApiResource\RessourceAPI;
use App\Entity\Ressource;
use App\Entity\Utilisateur;
use App\Repository\RessourceRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: RessourceAPI::class, to: Ressource::class)]
class RessourceApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private RessourceRepository $ressourceRepository,
        private MicroMapperInterface $microMapper,
        private Security $security,
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO ressource à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof RessourceAPI);

        // Charge l'entité ressource existante ou crée une nouvelle instance.
        $ressourceEntity = $dto->id ? $this->ressourceRepository->find($dto->id) : new Ressource();
        // Si l'entité ressource n'existe pas, lance une exception.
        if(!$ressourceEntity){
            throw new \Exception('Ressource non trouvé');
        }

        // Retourne l'entité ressource.
        return $ressourceEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO categorie à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof RessourceAPI);

        // Obtient l'entité categorie
        $entity = $to;
        assert($entity instanceof Ressource);

        $entity->setTitre($dto->titre);
        $entity->setContenu($dto->contenu);
        $entity->setDateCreation($dto->dateCreation);
        $entity->setDateModification($dto->dateModification);
        $entity->setNombreVue($dto->nombreVue);

        if ($dto->proprietaire) {
            $entity->setProprietaire($this->microMapper->map($dto->proprietaire, Utilisateur::class, [
                MicroMapperInterface::MAX_DEPTH => 0,
            ]));
        } else {
            $entity->setProprietaire($this->security->getUser());
        }

        // Retourne l'entité utilisateur mise à jour.
        return $entity;
    }
}