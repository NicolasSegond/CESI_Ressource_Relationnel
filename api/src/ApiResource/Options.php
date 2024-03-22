<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Entity\Categorie;
use App\Entity\TypeDeRessource;
use App\Entity\TypeRelation;
use Symfony\Component\Serializer\Attribute\Groups;
class Options
{
    public array $categories;

    public array $relationTypes;

    public array $resourceTypes;
}