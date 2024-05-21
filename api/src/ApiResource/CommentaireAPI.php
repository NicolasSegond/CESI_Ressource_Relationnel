<?php

namespace App\ApiResource;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\State\Options;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\Ressource;
use App\Entity\Utilisateur;
use App\State\DtoToEntityStateProcessor;
use App\State\EntityToDtoStateProvider;
use App\Entity\Commentaire;

use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'Commentaire',
    operations: [
        new GetCollection(),
        new Get(),
        new GetCollection(
            uriTemplate: '/commentaires/{id}/ressources',
            uriVariables: [
                'id' => new Link(
                    fromProperty: 'commentaires',
                    fromClass: RessourceAPI::class,
                )
            ],
        ),
        new Post(),
        new Delete(),
    ],


    normalizationContext: [
        'groups' => ['commentaire:read']
    ],
    paginationItemsPerPage: 10,
    provider: EntityToDtoStateProvider::class,
    processor: DtoToEntityStateProcessor::class, # POST, PUT, PATCH
    stateOptions: new Options(entityClass: Commentaire::class),
)]


#[ApiFilter(OrderFilter::class, properties: ['date' => 'ASC'])]
class CommentaireAPI
{
    #[Groups(['commentaire:read'])]
    public ?int $id = null;

    #[Groups(['ressource:read', 'ressource:write', 'commentaire:read', 'progression:read'])]
    public ?string $contenu = null;

    #[Groups(['ressource:read', 'ressource:write', 'commentaire:read', 'progression:read'])]
    public ?UtilisateurAPI $utilisateur = null;

    #[Groups(['ressource:read', 'commentaire:write', 'commentaire:read', 'progression:read'])]
    public ?RessourceAPI $ressource = null;

    #[Groups(['ressource:read', 'ressource:write', 'commentaire:read', 'progression:read'])]
    public ?\DateTimeInterface $date = null;
}
