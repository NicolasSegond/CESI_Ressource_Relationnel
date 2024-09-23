<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\CategorieController;
use App\Controller\OptionsController;
use App\Entity\Categorie;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;


#[ApiResource(
    shortName: 'Categorie',
    operations: [
        new Patch(security: "is_granted('ROLE_ADMIN')")
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Categorie::class),
)]
#[ApiResource(
    shortName: 'Options',
    operations: [
        new GetCollection(
            uriTemplate: '/options',
            controller: OptionsController::class,
        ),
    ],
    provider: EntityToDtoStateProvider::class,
    processor: DtoToEntityStateProcessor::class,
    stateOptions: new Options(entityClass: Categorie::class),
)]
class CategorieAPI
{
    #[Groups('ressource:read', 'ressource:write')]
    public ?int $id = null;

    #[Groups('ressource:read', 'ressource:write')]
    public ?string $nom = null;
}
