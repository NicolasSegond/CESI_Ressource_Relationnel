<?php

namespace App\Controller;

use App\Repository\RessourceRepository;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RessourceController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RessourceRepository $ressourceRepository,
        private UtilisateurRepository $utilisateurRepository
    ) {
    }

    public function voir(Request $request)
    {
        // Décoder le contenu JSON de la requête
        $data = json_decode($request->getContent(), true);

        // Récupérer la valeur de la clé "voirRessource" du tableau JSON décodé
        $voirRessourceIds = $data['voirRessource'];

        $ressource = $this->ressourceRepository->find($request->attributes->get('id'));

        foreach ($voirRessourceIds as $userId) {
            // Charger l'utilisateur correspondant à l'identifiant
            $utilisateur = $this->utilisateurRepository->find($userId);

            if ($utilisateur) {
                // Ajouter l'utilisateur à la ressource
                $ressource->addVoirRessource($utilisateur);
            }
        }

        // Enregistrer les modifications
        $this->entityManager->persist($ressource);
        $this->entityManager->flush();

        // Retourner la valeur sous forme de réponse JSON
        return $this->json($voirRessourceIds);
    }

    public function nePlusVoir(Request $request)
    {

        // Récupérer la valeur de la clé "nePlusVoirRessource" du tableau JSON décodé
        $id_utilisateur = $request->query->get('utilisateur_id');

        $ressource = $this->ressourceRepository->find($request->attributes->get('id'));

        if(!$ressource){
            throw new HttpException(404, "La ressource n'existe pas");
        }

        // Charger l'utilisateur correspondant à l'identifiant
        $utilisateur = $this->utilisateurRepository->find($id_utilisateur);

        if($utilisateur){
            // Ajouter l'utilisateur à la ressource
            $ressource->removeVoirRessource($utilisateur);
        } else{
            throw new HttpException(404, "L'utilisateur n'existe pas");
        }

        // Enregistrer les modifications
        $this->entityManager->persist($ressource);
        $this->entityManager->flush();

        // Retourner la valeur sous forme de réponse JSON
        return $this->json(['message' => 'L\'utilisateur ne voit plus la ressource']);
    }

}