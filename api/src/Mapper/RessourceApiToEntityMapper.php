<?php

namespace App\Mapper;

use App\ApiResource\CommentaireAPI;
use App\ApiResource\RessourceAPI;
use App\ApiResource\VoirRessourceAPI;
use App\Entity\Categorie;
use App\Entity\Commentaire;
use App\Entity\Ressource;
use App\Entity\Statut;
use App\Entity\TypeDeRessource;
use App\Entity\TypeRelation;
use App\Entity\Utilisateur;
use App\Entity\Visibilite;
use App\Entity\VoirRessource;
use App\Repository\RessourceRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PropertyAccess\PropertyAccessorInterface;
use Symfony\Component\Serializer\SerializerInterface;
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
        private PropertyAccessorInterface $propertyAccessor,
        private SerializerInterface $serializer
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
        // Obtient le DTO Ressource à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof RessourceAPI);

        // Obtient l'entité Ressource
        $entity = $to;
        assert($entity instanceof Ressource);

        $entity->setTitre($dto->titre);
        $entity->setContenu($dto->contenu);
        $entity->setDateCreation($dto->dateCreation);
        $entity->setDateModification($dto->dateModification);
        $entity->setNombreVue($dto->nombreVue);

        if ($dto->proprietaire) {
            $entity->setProprietaire($this->microMapper->map($dto->proprietaire, Utilisateur::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        } else {
            $entity->setProprietaire($this->security->getUser());
        }

        $entity->setStatut($this->microMapper->map($dto->statut, Statut::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]));

        $entity->setVisibilite($this->microMapper->map($dto->visibilite, Visibilite::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]));

        $entity->setTypeDeRessource($this->microMapper->map($dto->typeDeRessource, TypeDeRessource::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]));

        $entity->setTypeRelation($this->microMapper->map($dto->typeRelation, TypeRelation::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]));

        $entity->setCategorie($this->microMapper->map($dto->categorie, Categorie::class, [
            MicroMapperInterface::MAX_DEPTH => 1,
        ]));

        foreach ($dto->voirRessources as $voirRessource) {

            $voirRessourceObject = $this->serializer->deserialize(json_encode($voirRessource), VoirRessourceAPI::class, 'json');

            $voirRessourcesEntities = $this->microMapper->map($voirRessourceObject, VoirRessource::class);

            $entity->addVoirRessource($voirRessourcesEntities);
        }

        // Retourne l'entité Ressource mise à jour.
        return $entity;
    }
}