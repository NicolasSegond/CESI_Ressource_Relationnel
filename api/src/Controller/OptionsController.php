<?php

namespace App\Controller;

use App\ApiResource\Options;
use App\Repository\CategorieRepository;
use App\Repository\TypeDeRessourceRepository;
use App\Repository\TypeRelationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;


class OptionsController extends AbstractController
{
    public function __construct(private CategorieRepository $categorieRepo, private TypeRelationRepository $typeRelationRepo, private TypeDeRessourceRepository $typeDeRessourceRepo)
    {
        $this->categorieRepo = $categorieRepo;
        $this->typeRelationRepo = $typeRelationRepo;
        $this->typeDeRessourceRepo = $typeDeRessourceRepo;
    }


    public function __invoke(): JsonResponse
    {
        $categories = $this->categorieRepo->findAll();
        $typesDeRessources = $this->typeDeRessourceRepo->findAll();
        $typesRelation = $this->typeRelationRepo->findAll();

        // Extraction des données pertinentes des objets et stockage dans des tableaux simples
        $categoryData = [];
        foreach ($categories as $category) {
            $categoryData[] = $category->toArray(); // Supposons que la méthode toArray() existe pour obtenir un tableau des données pertinentes de chaque objet
        }

        $resourceTypeData = [];
        foreach ($typesDeRessources as $typeDeRessource) {
            $resourceTypeData[] = $typeDeRessource->toArray();
        }

        $relationTypeData = [];
        foreach ($typesRelation as $typeRelation) {
            $relationTypeData[] = $typeRelation->toArray();
        }

        // Création d'un nouvel objet Options et assignation des tableaux extraits
        $allDataDto = new Options();
        $allDataDto->categories = $categoryData;
        $allDataDto->relationTypes = $relationTypeData;
        $allDataDto->resourceTypes = $resourceTypeData;

        return $this->json($allDataDto);
    }


}
