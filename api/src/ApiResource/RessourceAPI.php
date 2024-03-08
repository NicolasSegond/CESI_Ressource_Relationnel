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
use Symfony\Component\Serializer\Attribute\Groups;


#[ApiResource(
    shortName: 'Ressource',
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER')")
    ],
    normalizationContext: [
        'groups' => ['ressource:read']
    ],
    denormalizationContext: [
        'groups' => ['ressource:write']
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Ressource::class),
)]
class RessourceAPI
{
    #[Groups('ressource:read')]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $titre = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $contenu = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?\DateTimeInterface $dateCreation = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?\DateTimeInterface $dateModification = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?int $nombreVue = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?UtilisateurAPI $proprietaire = null;

    #[Groups(['ressource:read'])]
    public ?StatutAPI $statut = null;

    #[Groups(['ressource:read'])]
    public ?VisibiliteAPI $visibilite = null;

    #[Groups(['ressource:read'])]
    public ?TypeDeRessourceAPI $typeDeRessource = null;

    #[Groups(['ressource:read'])]
    public ?TypeRelationAPI $typeRelation = null;

    #[Groups(['ressource:read'])]
    public ?CategorieAPI $categorie = null;

    #[Groups(['ressource:read'])]
    public array $voirRessources = [];

    #[Groups(['ressource:read'])]
    public array $commentaires = [];

    #[Groups(['ressource:read'])]
    public array $progressions = [];
}