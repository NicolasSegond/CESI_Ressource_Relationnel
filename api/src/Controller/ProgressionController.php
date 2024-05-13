<?php

namespace App\Controller;

use App\Entity\Progression;
use App\Entity\Ressource;
use App\Entity\Statut;
use App\Entity\TypeProgression;
use App\Entity\Utilisateur;
use App\Repository\RessourceRepository;
use App\Repository\ProgressionRepository;
use App\Repository\UtilisateurRepository;
use App\Repository\VisibiliteRepository;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;


class ProgressionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,

    )
    {
    }

    public function delete(Request $request, Ressource $ressource, Utilisateur $utilisateur, TypeProgression $typeProgression): Response
    {
        // Recherche de la progression à supprimer
        $progression = $this->entityManager->getRepository(Progression::class)->findOneBy([
            'ressource' => $ressource,
            'utilisateur' => $utilisateur,
            'TypeProgression' => $typeProgression
            // Vous pouvez également ajouter d'autres critères si nécessaire
        ]);

        // Vérifie si la progression existe
        if (!$progression) {
            throw new BadRequestHttpException('La progression spécifiée n\'existe pas.');
        }

        // Suppression de la progression
        $this->entityManager->remove($progression);
        $this->entityManager->flush();

        // Réponse de succès
        return new Response('Progression supprimée avec succès.', Response::HTTP_OK);
    }

}