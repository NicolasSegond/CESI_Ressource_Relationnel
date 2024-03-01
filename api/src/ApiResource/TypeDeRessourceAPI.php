<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\TypeDeRessource as TypeDeRessourceEntity;
use App\State\EntityToDtoStateProvider;

#[ApiResource(
    shortName: 'TypeDeRessource',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class,
    stateOptions: new Options(entityClass: TypeDeRessourceEntity::class),
)]
class TypeDeRessourceAPI
{
    public ?int $id = null;
    public ?string $libelle;
}
