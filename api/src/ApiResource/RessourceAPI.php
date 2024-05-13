<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\RessourceController;
use App\Entity\Ressource;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Attribute\Groups;


#[ApiResource(
    shortName: 'Ressource',
    operations: [
        new GetCollection(),
        new Get(),
        new GetCollection(
            uriTemplate: '/ressources/validees',
        ),
        new Post(),
        new Delete(
            controller: RessourceController::class . '::delete',
            security: "is_granted('ROLE_USER')"
        ),
        new Patch(security: "is_granted('ROLE_USER')"),
        new Patch(
            uriTemplate: '/ressources/{id}/refuser',
            controller: RessourceController::class . '::refuser',
        ),
        new Patch(
            uriTemplate: '/ressources/{id}/valider',
            controller: RessourceController::class . '::valider',
            openapiContext: [
                'summary' => 'Valider une ressource',
                'description' => 'Valider une ressource en changeant son statut à "Validé".',
                'requestBody' => [
                    'content' => [
                        'application/merge-patch+json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [],
                            ],
                        ],
                    ],
                ],
            ],
        )
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
    shortName: 'DashboardAdmin',
    operations: [
        new GetCollection(
            uriTemplate: '/dashboard_admin/ressourcesByMonth',
            controller: RessourceController::class . '::dashboardAdmin',
        ),
        new Get(),
    ],
    normalizationContext: [
        'groups' => ['ressource:read']
    ],
    denormalizationContext: [
        'groups' => ['ressource:write']
    ],
    paginationItemsPerPage: 5,
    provider: EntityToDtoStateProvider::class,
    processor: DtoToEntityStateProcessor::class,
    stateOptions: new Options(entityClass: Ressource::class),
)]
#[ApiResource(
    shortName: 'VoirRessource',
    operations: [
        new Post(uriTemplate: '/voir_ressources/{id}/voir', controller: RessourceController::class . '::voir'),
        new Delete(uriTemplate: '/voir_ressources/{id}/voir', controller: RessourceController::class . '::nePlusVoir'),
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
    #[Groups(['ressource:read', 'commentaire:write', 'commentaire:read', 'progression:read'])]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    public ?string $titre = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    public ?string $miniature = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    public ?string $contenu = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    #[ApiFilter(DateFilter::class, properties: ['dateCreation'])]
    public ?\DateTimeInterface $dateCreation = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    public ?\DateTimeInterface $dateModification = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    #[ApiFilter(OrderFilter::class, properties: ['nombreVue'])]
    public ?int $nombreVue = null;

    #[Groups(['ressource:read', 'ressource:write', 'progression:read'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public ?UtilisateurAPI $proprietaire = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
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

    #[Groups(['ressource:read', 'ressource:write'])]
    #[ApiFilter(BooleanFilter::class, strategy: 'exact')]
    public ?bool $valide = null;

    #[Groups(['ressource:read', 'voirressource:write'])]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    public array $voirRessource = [];

    #[Groups(['ressource:read'])]
    public array $commentaires = [];

    #[Groups(['ressource:read'])]
    public array $progressions = [];

    #[Groups(['ressource:read', 'ressource:write'])]
    public Collection $fichiers;
}
