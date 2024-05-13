<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\TypeDeRessource as TypeDeRessourceEntity;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'TypeDeRessource',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT
    stateOptions: new Options(entityClass: TypeDeRessourceEntity::class),
)]
class TypeDeRessourceAPI
{
    #[Groups('ressource:read', 'ressource:write')]
    public ?int $id = null;

    #[Groups('ressource:read', 'ressource:write')]
    public ?string $libelle;
}
