<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Fichier',
    operations: [
        new Get(),
        new GetCollection(),
    ],
    normalizationContext: ['groups' => ['fichier:read']],
    denormalizationContext: ['groups' => ['fichier:write']]

)]

#[ApiResource(
    shortName: 'Upload',
    operations: [
        new Post(
            inputFormats: ['multipart' => ['multipart/form-data']],
            controller: 'App\Controller\UploadController::uploadFiles',
        ),
        new Post(
            uriTemplate: '/uploadsEdit',
            inputFormats: ['multipart' => ['multipart/form-data']],
            controller: 'App\Controller\UploadController::uploadFilesEdit',
        ),
    ],
    normalizationContext: ['groups' => ['upload:read']],
    denormalizationContext: ['groups' => ['upload:write']]

)]
class FichierAPI
{
    #[Groups(['ressource:read', 'ressource:write', 'fichier:read'])]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write', 'fichier:read', 'fichier:write'])]
    public ?RessourceAPI $ressource = null;

    #[Groups(['ressource:read', 'ressource:write', 'fichier:read', 'fichier:write'])]
    public ?string $nom = null;

    #[Groups(['ressource:read', 'ressource:write', 'fichier:read', 'fichier:write'])]
    public ?string $taille = null;

    #[Groups(['ressource:read', 'ressource:write', 'fichier:read', 'fichier:write'])]
    public ?\DateTimeImmutable $creation = null;

    #[Groups(['upload:write', 'upload:read'])]
    public ?string $idRessource = null;

    #[Groups(['upload:write', 'upload:read'])]
    public ?array $fichiers = null;
}