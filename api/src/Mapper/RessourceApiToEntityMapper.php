<?php

namespace App\Mapper;

use App\ApiResource\RessourceAPI;
use App\ApiResource\TypeRelationAPI;
use App\Entity\Categorie;
use App\Entity\Ressource;
use App\Entity\Statut;
use App\Entity\TypeDeRessource;
use App\Entity\TypeRelation;
use App\Entity\Utilisateur;
use App\Entity\Visibilite;
use App\Repository\RessourceRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\HttpException;
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

        if($dto->titre === ""){
            throw new HttpException(400, 'Le titre de la ressource ne peut pas être vide');
        } else{
            $entity->setTitre($dto->titre);
        }

        if($dto->contenu === ""){
            throw new HttpException(400, 'Le contenu de la ressource ne peut pas être vide');
        } else{
            $entity->setContenu($dto->contenu);
        }

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

        if($dto->statut === null){
            throw new HttpException(400, 'Le statut de la ressource ne peut pas être vide');
        } else{
            $entity->setStatut($this->microMapper->map($dto->statut, Statut::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        if($dto->visibilite === null){
            throw new HttpException(400, 'La visibilité de la ressource ne peut pas être vide');
        } else{
            $entity->setVisibilite($this->microMapper->map($dto->visibilite, Visibilite::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        if($dto->typeDeRessource == ''){
            throw new HttpException(400, 'Le type de ressource ne peut pas être vide');
        } else{
            $entity->setTypeDeRessource($this->microMapper->map($dto->typeDeRessource, TypeDeRessource::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        if($dto->categorie == ''){
            throw new HttpException(400, 'La catégorie de la ressource ne peut pas être vide');
        } else{
            $entity->setCategorie($this->microMapper->map($dto->categorie, Categorie::class, [
                MicroMapperInterface::MAX_DEPTH => 1,
            ]));
        }

        if($dto->typeRelations == null){
            throw new HttpException(400, 'Le type de relation de la ressource ne peut pas être vide');
        } else {
            $dragonTreasureEntities = [];
            foreach ($dto->typeRelations as $dragonTreasureApi) {
                $dragonTreasureApiObject = $this->serializer->deserialize(json_encode($dragonTreasureApi), TypeRelationAPI::class, 'json');

                // Now you can pass the object to the MicroMapper::map() method
                $dragonTreasureEntities[] = $this->microMapper->map($dragonTreasureApiObject, TypeRelation::class, [
                    MicroMapperInterface::MAX_DEPTH => 0,
                ]);
            }
            $this->propertyAccessor->setValue($entity, 'typeRelations', $dragonTreasureEntities);
        }

        // Retourne l'entité Ressource mise à jour.
        return $entity;
    }
}