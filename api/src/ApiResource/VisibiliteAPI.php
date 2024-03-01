<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Visibilite;
use App\State\EntityToDtoStateProvider;

#[ApiResource(
    shortName: 'Visibilite',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class, #GET, GET Collection
    stateOptions: new Options(entityClass: Visibilite::class)
)]
class VisibiliteAPI
{
    public ?int $id = null;
    public ?string $libelle = null;
}