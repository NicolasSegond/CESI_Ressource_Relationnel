<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\TypeRelation as TypeRelationEntity;
use App\State\EntityToDtoStateProvider;

#[ApiResource(
    shortName: 'TypeRelation',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class,
    stateOptions: new Options(entityClass: TypeRelationEntity::class),
)]
class TypeRelationAPI
{
    public ?int $id = null;
    public ?string $libelle;
}
