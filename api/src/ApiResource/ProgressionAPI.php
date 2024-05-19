<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\ProgressionController;
use App\Controller\RessourceController;
use App\Entity\Progression;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;


#[ApiResource(
    shortName: 'Progression',
    operations: [
        new GetCollection(),
        new Post(),
        new Delete(),
    ],
    normalizationContext: [
        'groups' => ['progression:read']
    ],
    paginationItemsPerPage: 5,
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Progression::class),
)]
class ProgressionAPI
{
    #[Groups(['progression:read', 'ressource:read'] )]
    public ?int $id = null;

    #[Groups(['progression:read', 'ressource:read'])]
    #[ApiFilter(SearchFilter::class, strategy: "exact")]
    public ?TypeProgressionAPI $TypeProgression = null;

    #[Groups(['progression:read', 'ressource:read'])]
    #[ApiFilter(SearchFilter::class, strategy: "exact")]
    public ?UtilisateurAPI $Utilisateur = null;

    #[Groups(['progression:read'])]
    public ?RessourceAPI $Ressource = null;
}
