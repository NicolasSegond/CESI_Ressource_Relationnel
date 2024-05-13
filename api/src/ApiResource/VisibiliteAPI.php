<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Visibilite;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Visibilite',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class, #GET, GET Collection
    processor: DtoToEntityStateProcessor::class, #POST, PUT, DELETE
    stateOptions: new Options(entityClass: Visibilite::class)
)]
class VisibiliteAPI
{
    #[Groups('ressource:read', 'ressource:write')]
    public ?int $id = null;

    #[Groups('ressource:read', 'ressource:write')]
    public ?string $libelle = null;
}