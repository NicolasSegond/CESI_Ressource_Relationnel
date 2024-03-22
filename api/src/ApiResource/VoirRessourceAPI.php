<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Entity\VoirRessource;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'VoirRessource',
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Delete()
    ],
    provider: EntityToDtoStateProvider::class, #GET, GET Collection
    processor: DtoToEntityStateProcessor::class, #POST, PUT, DELETE
    stateOptions: new Options(entityClass: VoirRessource::class)
)]
class VoirRessourceAPI
{
    public ?int $id = null;

    #[Groups('ressource:read', 'ressource:write')]
    public ?UtilisateurAPI $utilisateur = null;

    #[Groups('ressource:read', 'ressource:write')]
    public ?RessourceAPI $ressource = null;
}