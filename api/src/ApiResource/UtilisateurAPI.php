<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\UserController;
use App\Entity\Utilisateur;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'Utilisateur',
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER')"),
        new Post(),
        new Get(
            name: 'verif',
            uriTemplate: '/verif/{id}/{code}/{tokenVerif}',
            controller: UserController::class
        ),
        new Patch(security: "is_granted('ROLE_USER')"),
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Utilisateur::class),
)]
#[ApiResource(
    shortName: 'Utilisateur',
    operations: [
        new GetCollection(
            uriTemplate: '/utilisateurs/{id}/roles',
            normalizationContext: ['groups' => ['roles:read']],
            security: "is_granted('ROLE_USER')"
        ),
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Utilisateur::class),
)]
class UtilisateurAPI
{
    #[Groups(['ressource:read', 'commentaire:read'])]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write'])]
    public ?string $email = null;

    #[Groups(['ressource:read', 'commentaire:read'])]
    public ?string $nom = null;

    #[Groups(['ressource:read', 'commentaire:read'])]
    public ?string $prenom = null;

    public ?string $password = null;

    #[Groups(['ressource:read', 'roles:read'])]
    public ?array $roles = [];

    #[Groups('ressource:read')]
    public ?int $code = null;

    #[Groups('ressource:read')]
    public ?string $tokenVerif = null;

    #[Groups('ressource:read')]
    public ?bool $verif = false;

    #[Groups('ressource:read')]
    public array $ressources = [];
}