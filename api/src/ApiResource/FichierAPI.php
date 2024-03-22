<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Fichier',
    operations: [
        new Get(),
        new GetCollection(),
    ]

)]
class FichierAPI
{
    #[Groups(['ressource:read', 'ressource:write'])]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?RessourceAPI $ressource = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $nom = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $taille = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?\DateTimeImmutable $creation = null;
}