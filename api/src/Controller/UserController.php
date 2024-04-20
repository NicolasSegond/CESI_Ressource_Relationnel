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
    public function __invoke(UtilisateurAPI $data, int $id, int $code, string $tokenVerif): JsonResponse
    {
        // Recherchez l'utilisateur par ID
        $utilisateur = $this->utilisateurRepository->find($id);

        // Vérifiez si l'utilisateur existe
        if (is_null($utilisateur)) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Vérifiez si le compte est déjà vérifié
        if ($utilisateur->getVerif()) {
            return new JsonResponse(['check' => 'Compte déjà vérifié'], 406);
        }

        // Vérifiez si le code correspond
        if ($utilisateur->getCode() == $code && $utilisateur->getTokenVerif() == $tokenVerif) {
            // Mise à jour de verif à true si le code est correct
            $utilisateur->setVerif(true);
            $this->entityManager->flush();
            return new JsonResponse(['check' => 'Compte vérifié'], 200);
        }

        return new JsonResponse(['error' => 'Code incorrect'], 400);
    }
}