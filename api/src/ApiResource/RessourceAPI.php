<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use App\Controller\OptionsController;
use App\Controller\RessourceController;
use App\Entity\Categorie;
use App\Entity\Ressource;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;


#[ApiResource(
    shortName: 'Ressource',
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Delete(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_USER')")
    ],
    normalizationContext: [
        'groups' => ['ressource:read']
    ],
    denormalizationContext: [
        'groups' => ['ressource:write']
    ],
    paginationItemsPerPage: 5,
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Ressource::class),
)]
#[ApiResource(
    shortName: 'Ressource',
    operations: [
        new GetCollection(
            uriTemplate: '/visibilite/ressources',
            controller: RessourceController::class,
        ),
        new Post(uriTemplate: '/ressources/{id}/voir', controller: RessourceController::class . '::voir'),
        new Delete(uriTemplate: '/ressources/{id}/voir', controller: RessourceController::class . '::nePlusVoir'),
    ],
    denormalizationContext: [
        'groups' => ['voirressource:write']
    ],
    paginationItemsPerPage: 5,
    provider: EntityToDtoStateProvider::class,
    processor: DtoToEntityStateProcessor::class,
    stateOptions: new Options(entityClass: Ressource::class),
)]
class RessourceAPI
{
    #[Groups('ressource:read')]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $titre = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $miniature = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $contenu = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?\DateTimeInterface $dateCreation = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?\DateTimeInterface $dateModification = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?int $nombreVue = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public ?UtilisateurAPI $proprietaire = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?StatutAPI $statut = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public ?VisibiliteAPI $visibilite = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public ?TypeDeRessourceAPI $typeDeRessource = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public array $typeRelations = [];

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public ?CategorieAPI $categorie = null;

    #[Groups(['ressource:read', 'voirressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public array $voirRessource = [];

    #[Groups(['ressource:read'])]
    public array $commentaires = [];

    #[Groups(['ressource:read'])]
    public array $progressions = [];
}