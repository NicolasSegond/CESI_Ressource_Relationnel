<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Statut;
use App\State\EntityToDtoStateProvider;

#[ApiResource(
    shortName: 'Statut',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class,# GET, GET collection
    stateOptions: new Options(entityClass: Statut::class),

)]
class StatutAPI
{
    public ?int $id = null;
    public ?string $nomStatut = null;
}