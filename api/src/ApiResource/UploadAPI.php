<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Entity\Ressource;

//#[ApiResource(
//    shortName: 'Upload',
//    operations: [
//        new Post(
//            inputFormats: ['multipart' => ['multipart/form-data']],
//            controller: 'App\Controller\UploadAction::uploadFiles'
//        ),
//    ]
//)]
class UploadAPI
{
    public ?Ressource $ressource = null;

    public ?array $fichiers = [];
}