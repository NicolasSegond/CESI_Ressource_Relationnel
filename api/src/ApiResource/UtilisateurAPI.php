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

#[ApiResource(
    shortName: 'Utilisateur',
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER')"),
        new Post(),
        new Get(
            name: 'verif',
            uriTemplate: '/verif/{id}/{code}',
            controller: UserController::class
        ),
        new Patch(security: "is_granted('ROLE_USER')"),
    ],
    provider: EntityToDtoStateProvider::class, # GET, GET collection
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Utilisateur::class),
)]
class UtilisateurAPI
{
    public ?int $id = null;

    public ?string $email = null;
    public ?string $nom = null;
    public ?string $prenom = null;

    public ?string $password = null;

    public ?array $roles = [];

    public ?int $code = null;
    public ?bool $verif = false;
}