<?php

namespace App\Controller;

use App\Entity\Ressource;
use App\Entity\Statut;
use App\Repository\RessourceRepository;
use App\Repository\UtilisateurRepository;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RessourceController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RessourceRepository    $ressourceRepository,
        private UtilisateurRepository  $utilisateurRepository,
        private EmailService           $emailService
    )
    {
    }

    public function dashboardAdmin(Request $request)
    {
        // Définir la localisation en français
        setlocale(LC_TIME, 'fr_FR.utf8', 'fr_FR', 'fr');

        // Récupérer les dates sélectionnées depuis la requête
        // Valider et nettoyer les paramètres de date d'entrée
        $data = $request->query->all();

        $startDate = isset($data['dateCreation']['before']) ? $data['dateCreation']['after'] : null;
        $endDate = isset($data['dateCreation']['after']) ? $data['dateCreation']['before'] : null;

        $startDateObj = $startDate ? new \DateTimeImmutable($startDate) : new \DateTimeImmutable();
        $endDateObj = $endDate ? new \DateTimeImmutable($endDate) : new \DateTimeImmutable();

        $startDateObj = $startDateObj->format('Y-m-d');
        $endDateObj = $endDateObj->format('Y-m-d');
        // Récupérer la catégorie sélectionnée depuis la requête
        $selectedCategory = $data['categorie'] ?? null;

        // Requête SQL pour récupérer le nombre de ressources créées par mois
        $queryBuilder = $this->entityManager->createQueryBuilder()
            ->select("SUBSTRING(r.dateCreation, 6, 2) as moisCreation, COUNT(r.id) as count")
            ->from(Ressource::class, 'r')
            ->where("r.dateCreation BETWEEN :startDate AND :endDate")
            ->setParameter("startDate", $startDateObj)
            ->setParameter("endDate", $endDateObj);

        // Filtrer par catégorie si elle est définie
        if ($selectedCategory) {
            $queryBuilder->andWhere("r.categorie = :category")
                ->setParameter("category", $selectedCategory);
        }

        $query = $queryBuilder->groupBy("moisCreation")
            ->orderBy("moisCreation", "ASC")
            ->getQuery();

        $result = $query->getResult();

        // Convertir le numéro de mois en nom de mois en français
        foreach ($result as &$row) {
            $numMois = intval($row['moisCreation']);
            $nomMois = strftime("%B", mktime(0, 0, 0, $numMois, 1));
            $row['moisCreation'] = ucfirst($nomMois); // Met en majuscule la première lettre du mois
        }

        // Ajout de la récupération du nombre d'utilisateurs selon leur statut de vérification
        $verifiedUsersCount = $this->utilisateurRepository->findBy(['verif' => 1]);
        $unverifiedUsersCount = $this->utilisateurRepository->findBy(['verif' => 0]);
        $pendingVerificationUsersCount = $this->utilisateurRepository->findBy(['verif' => 2]);

        // Récupérer les ressources validées créées entre les deux dates
        $ressourceValideQueryBuilder = $this->ressourceRepository->createQueryBuilder('r')
            ->where('r.statut = :statut')
            ->andWhere('r.dateCreation >= :startDate')
            ->andWhere('r.dateCreation <= :endDate')
            ->setParameter('statut', 1)
            ->setParameter('startDate', $startDateObj)
            ->setParameter('endDate', $endDateObj);

        // Filtrer par catégorie si elle est définie
        if ($selectedCategory) {
            $ressourceValideQueryBuilder->andWhere('r.categorie = :category')
                ->setParameter('category', $selectedCategory);
        }

        $ressourceValide = $ressourceValideQueryBuilder->getQuery()->getResult();

        // Récupérer les ressources en attente créées entre les deux dates
        $ressourceEnAttenteQueryBuilder = $this->ressourceRepository->createQueryBuilder('r')
            ->where('r.statut = :statut')
            ->andWhere('r.dateCreation >= :startDate')
            ->andWhere('r.dateCreation <= :endDate')
            ->setParameter('statut', 2)
            ->setParameter('startDate', $startDateObj)
            ->setParameter('endDate', $endDateObj);

        // Filtrer par catégorie si elle est définie
        if ($selectedCategory) {
            $ressourceEnAttenteQueryBuilder->andWhere('r.categorie = :category')
                ->setParameter('category', $selectedCategory);
        }

        $ressourceEnAttente = $ressourceEnAttenteQueryBuilder->getQuery()->getResult();

        // Récupérer les ressources refusées créées entre les deux dates
        $ressourceRefuseQueryBuilder = $this->ressourceRepository->createQueryBuilder('r')
            ->where('r.statut = :statut')
            ->andWhere('r.dateCreation >= :startDate')
            ->andWhere('r.dateCreation <= :endDate')
            ->setParameter('statut', 3)
            ->setParameter('startDate', $startDateObj)
            ->setParameter('endDate', $endDateObj);

        // Filtrer par catégorie si elle est définie
        if ($selectedCategory) {
            $ressourceRefuseQueryBuilder->andWhere('r.categorie = :category')
                ->setParameter('category', $selectedCategory);
        }

        $ressourceRefuse = $ressourceRefuseQueryBuilder->getQuery()->getResult();

        $response = [
            'ressources' => $result,
            'verifier' => count($verifiedUsersCount),
            'non_verifier' => count($unverifiedUsersCount),
            'bannis' => count($pendingVerificationUsersCount),
            'ressource_valide' => count($ressourceValide),
            'ressource_en_attente' => count($ressourceEnAttente),
            'ressource_refuse' => count($ressourceRefuse)
        ];


        return $this->json($response);
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

        if (!$ressource) {
            throw new HttpException(404, "La ressource n'existe pas");
        }

        // Charger l'utilisateur correspondant à l'identifiant
        $utilisateur = $this->utilisateurRepository->find($id_utilisateur);

        if ($utilisateur) {
            // Ajouter l'utilisateur à la ressource
            $ressource->removeVoirRessource($utilisateur);
        } else {
            throw new HttpException(404, "L'utilisateur n'existe pas");
        }

        // Enregistrer les modifications
        $this->entityManager->persist($ressource);
        $this->entityManager->flush();

        // Retourner la valeur sous forme de réponse JSON
        return $this->json(['message' => 'L\'utilisateur ne voit plus la ressource']);
    }

    public function delete(Request $request)
    {
        $ressource = $this->ressourceRepository->find($request->attributes->get('id'));

        if (!$ressource) {
            throw new HttpException(404, "La ressource n'existe pas");
        }

        $proprietaire = $ressource->getProprietaire();
        $destinataire = $proprietaire->getEmail();
        $sujet = 'Suppression de votre ressource';
        $contenu = '<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Suppression de votre ressource</title>
                    <style>
                        * {
                            box-sizing: border-box;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                            -webkit-text-size-adjust: none;
                            text-size-adjust: none;
                            background-color: #f8f6ff;
                        }
                
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: none !important;
                        }
                
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                        }
                
                        h1 {
                            color: #292929;
                            font-size: 32px;
                            font-weight: 700;
                            line-height: 120%;
                            margin: 0;
                        }
                
                        p {
                            color: #292929;
                            font-size: 16px;
                            line-height: 24px;
                            margin: 10px 0;
                        }
                
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #03989e;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                
                        .button:hover {
                            background-color: #027373;
                        }
                    </style>
                </head>
                <body>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 20px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #4626c7; color: #ffffff;">
                                    <tr>
                                        <td align="center">
                                            <img src="https://image.noelshack.com/fichiers/2024/08/3/1708554294-logo.png" alt="Logo" width="200">
                                        </td>
                                    </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                                    <tr>
                                        <td>
                                            <h1>Suppression de votre ressource</h1>
                                            <p>Votre ressource intitulée "<strong>' . $ressource->getTitre() . '</strong>" a été supprimée définitivement par l\'administrateur.</p>
                                            <p>Nous vous informons que votre ressource a été supprimée par l\'administrateur du site car elle ne respectait pas les règles pour la publication d\'une ressource. Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                                            <p>Cordialement,<br>L\'équipe de gestion</p>
                                        </td>
                                    </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                                    <tr>
                                        <td align="center">
                                            <p>Vous avez reçu cet e-mail car vous êtes abonné à notre site.</p>
                                            <p>Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>';

        $this->emailService->sendEmail($destinataire, $sujet, $contenu);

        $this->entityManager->remove($ressource);
        $this->entityManager->flush();

        return $this->json(['message' => 'La ressource a été supprimée']);
    }


    public function valider(Request $request)
    {
        $ressource = $this->ressourceRepository->find($request->attributes->get('id'));

        if (!$ressource) {
            throw new HttpException(404, "La ressource n'existe pas");
        }

        if ($ressource->getStatut()->getId() == 1) {
            throw new HttpException(400, "La ressource est déjà validée");
        }

        $statut = $this->entityManager->getRepository(Statut::class)->findOneBy(['id' => '1']);

        $ressource->setStatut($statut);

        $this->entityManager->persist($ressource);
        $this->entityManager->flush();

        $proprietaire = $ressource->getProprietaire();
        $destinataire = $proprietaire->getEmail();
        $sujet = 'Validation de votre ressource';
        $contenu = '<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Validation de votre ressource</title>
                    <style>
                        * {
                            box-sizing: border-box;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                            -webkit-text-size-adjust: none;
                            text-size-adjust: none;
                            background-color: #f8f6ff;
                        }
                
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: none !important;
                        }
                
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                        }
                
                        h1 {
                            color: #292929;
                            font-size: 32px;
                            font-weight: 700;
                            line-height: 120%;
                            margin: 0;
                        }
                
                        p {
                            color: #292929;
                            font-size: 16px;
                            line-height: 24px;
                            margin: 10px 0;
                        }
                
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #03989e;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                
                        .button:hover {
                            background-color: #027373;
                        }
                    </style>
                </head>
                <body>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 20px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #4626c7; color: #ffffff;">
                                    <tr>
                                        <td align="center">
                                            <img src="https://image.noelshack.com/fichiers/2024/08/3/1708554294-logo.png" alt="Logo" width="200">
                                        </td>
                                    </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                                    <tr>
                                        <td>
                                            <h1>Validation de votre ressource</h1>
                                            <p>Votre ressource intitulée "<strong>' . $ressource->getTitre() . '</strong>" a été validée par l\'administrateur.</p>
                                            <p>Votre ressource est désormais visible par les utilisateurs du site. Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                                            <p>Cordialement,<br>L\'équipe de gestion</p>
                                        </td>
                                    </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                                    <tr>
                                        <td align="center">
                                            <p>Vous avez reçu cet e-mail car vous êtes abonné à notre site.</p>
                                            <p>Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>';

        $this->emailService->sendEmail($destinataire, $sujet, $contenu);

        return $this->json(['message' => 'La ressource a été validée']);
    }

    public function refuser(Request $request)
    {
        $ressource = $this->ressourceRepository->find($request->attributes->get('id'));

        $data = json_decode($request->getContent(), true);

        $message = $data['message'] ?? '';

        if (!$ressource) {
            throw new HttpException(404, "La ressource n'existe pas");
        }

        if ($ressource->getStatut()->getId() == 3) {
            throw new HttpException(400, "La ressource est déjà refusée");
        }

        $statut = $this->entityManager->getRepository(Statut::class)->findOneBy(['id' => '3']);

        $ressource->setStatut($statut);

        $this->entityManager->persist($ressource);
        $this->entityManager->flush();

        $proprietaire = $ressource->getProprietaire();

        $destinataire = $proprietaire->getEmail();

        $sujet = 'Refus de votre ressource';

        $contenu = '<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Refus de votre ressource</title>
                    <style>
                        * {
                            box-sizing: border-box;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                            -webkit-text-size-adjust: none;
                            text-size-adjust: none;
                            background-color: #f8f6ff;
                        }
                
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                            text-decoration: none !important;
                        }
                
                        #MessageViewBody a {
                            color: inherit;
                            text-decoration: none;
                        }
                
                        h1 {
                            color: #292929;
                            font-size: 32px;
                            font-weight: 700;
                            line-height: 120%;
                            margin: 0;
                        }
                
                        p {
                            color: #292929;
                            font-size: 16px;
                            line-height: 24px;
                            margin: 10px 0;
                        }
                
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #03989e;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                
                        .button:hover {
                            background-color: #027373;
                        }
                    </style>
                </head>
                <body>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="padding: 20px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #4626c7; color: #ffffff;">
                                    <tr>
                                        <td align="center">
                                            <img src="https://image.noelshack.com/fichiers/2024/08/3/1708554294-logo.png" alt="Logo" width="200">
                                        </td>
                                    </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                                    <tr>
                                        <td>
                                            <h1>Refus de votre ressource</h1>
                                            <p>Votre ressource intitulée "<strong>' . $ressource->getTitre() . '</strong>" a été refusée ou suspendu par l\'administrateur.</p>
                                            <p>Nous vous informons que votre ressource a été refusée par l\'administrateur du site car elle ne respectait pas les règles pour la publication d\'une ressource. C\'est à dire pour ces raisons : <strong>' . $message . ' </strong> Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                                            <p>Cordialement,<br>L\'équipe de gestion</p>
                                        </td>
                                    </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                                    <tr>
                                        <td align="center">
                                            <p>Vous avez reçu cet e-mail car vous êtes abonné à notre site.</p>
                                            <p>Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>';

        $this->emailService->sendEmail($destinataire, $sujet, $contenu);

        return $this->json(['message' => 'La ressource a été refusée']);
    }
}