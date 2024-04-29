<?php

namespace App\Controller;

use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class CategorieController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager, private CategorieRepository $categorieRepository)
    {

    }

    public function delete(Request $request)
    {
        $id = $request->attributes->get('id');
        $categorie = $this->categorieRepository->find($id);

        if (!$categorie) {
            throw $this->createNotFoundException('La catégorie n\'existe pas');
        }

        $this->entityManager->remove($categorie);
        $this->entityManager->flush();

        return $this->json(["message" => "La catégorie a bien été supprimée."]);
    }
}