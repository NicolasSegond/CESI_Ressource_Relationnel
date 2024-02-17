<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Entity\Categorie;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;


#[ApiResource(
    shortName: 'Categorie',
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER')")
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Categorie::class),
)]
class CategorieAPI
{
    public ?int $id = null;
    public ?string $nom = null;
}