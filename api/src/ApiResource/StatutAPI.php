<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Statut;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Statut',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT
    stateOptions: new Options(entityClass: Statut::class),
)]
class StatutAPI
{
    #[Groups('ressource:read', 'ressource:write')]
    public ?int $id = null;
    #[Groups('ressource:read', 'ressource:write')]
    public ?string $nomStatut = null;
}