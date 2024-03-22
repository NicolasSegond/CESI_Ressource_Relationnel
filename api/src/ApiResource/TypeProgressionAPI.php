<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\State\EntityToDtoStateProvider;
use App\Entity\TypeProgression;

#[ApiResource(
    shortName: 'TypeProgression',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class,
    stateOptions: new Options(entityClass: TypeProgression::class),
)]
class TypeProgressionAPI
{
    public ?int $id = null;
    public ?string $libelle;
}