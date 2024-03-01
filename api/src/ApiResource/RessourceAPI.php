<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Entity\Categorie;
use App\Entity\Progression;
use App\Entity\Ressource;
use App\Entity\Statut;
use App\Entity\TypeDeRessource;
use App\Entity\TypeRelation;
use App\Entity\Utilisateur;
use App\Entity\Visibilite;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Doctrine\Common\Collections\Collection;


#[ApiResource(
    shortName: 'Ressource',
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER')")
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Ressource::class),
)]
class RessourceAPI
{
    public ?int $id = null;
    public ?string $titre = null;

    public ?string $contenu = null;
    public ?\DateTimeInterface $dateCreation = null;

    public ?\DateTimeInterface $dateModification = null;

    public ?int $nombreVue = null;
    public ?UtilisateurAPI $proprietaire = null;

    public ?StatutAPI $statut = null;

    public ?VisibiliteAPI $visibilite = null;

    public ?TypeDeRessourceAPI $typeDeRessource = null;

    public ?TypeRelationAPI $typeRelation = null;

    public ?CategorieAPI $categorie = null;

    public array $voirRessources;

    public array $commentaires;

    public array $progressions;
}