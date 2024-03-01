<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\State\EntityToDtoStateProvider;
use App\Entity\Commentaire;

#[ApiResource(
    shortName: 'Commentaire',
    operations: [
        new GetCollection(),
        new Get()
    ],
    provider: EntityToDtoStateProvider::class,
    stateOptions: new Options(entityClass: Commentaire::class),
)]
class CommentaireAPI
{
    public ?int $id = null;
    public ?string $contenu = null;
    public ?\DateTimeInterface $date = null;
}