<?php

namespace App\Controller;

use App\ApiResource\UtilisateurAPI;
use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends AbstractController
{
    private UtilisateurRepository $utilisateurRepository;
    private EntityManagerInterface $entityManager;
    public function __construct(UtilisateurRepository  $utilisateurRepository, EntityManagerInterface $entityManager)
    {
        $this->utilisateurRepository = $utilisateurRepository;
        $this->entityManager = $entityManager;
    }
    public function __invoke(UtilisateurAPI $data, int $id, int $code): JsonResponse
    {
        // Recherchez l'utilisateur par ID

        $utilisateur = $this->utilisateurRepository->find($id);

        // Vérifiez si l'utilisateur existe
        if (is_null($utilisateur)) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Vérifiez si le code correspond
        if (!$utilisateur->getVerif()) {
            if ($utilisateur->getCode() == $code) {
                // Mise à jour de verif à 0 si le code est incorrect
                $utilisateur->setVerif(true);
                $this->entityManager->flush();
                return new JsonResponse(['check' => 'Compte Vérifier'], 200);
            }
        }
        else
            return new JsonResponse(['check' => 'Compte déjà vérifier'], 406);

        return new JsonResponse(['error' => 'Erreur interne'], 400);
    }
}