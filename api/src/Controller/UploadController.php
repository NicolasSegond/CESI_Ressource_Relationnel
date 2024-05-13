<?php

namespace App\Controller;

use App\Entity\Fichier;
use App\Entity\Ressource;
use Doctrine\Persistence\ManagerRegistry as PersistenceManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

// Importez la classe UploadedFile ici

class UploadController extends AbstractController
{
    public function uploadFiles(Request $request, SluggerInterface $slugger, PersistenceManagerRegistry $doctrine): Response
    {
        // Récupérer tous les fichiers envoyés
        $files = $request->files->get('fichiers');

        $id = $request->request->get('idRessource');

        if($request->files->get('miniature') !== null){
            $miniature = $request->files->get('miniature');
        }

        if (empty($request->files->get('miniature'))) {
            return $this->json(['message' => 'No file sent'], Response::HTTP_BAD_REQUEST);
        }

        // Initialiser l'entityManager en dehors de la boucle
        $entityManager = $doctrine->getManager();

        $Ressource = $doctrine->getRepository(Ressource::class)->find($id);

        if(isset($miniature)){
            foreach($miniature as $uploadedFile){
                if ($uploadedFile instanceof UploadedFile) {
                    // Générer un nom de fichier unique
                    $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFilename = $slugger->slug($originalFilename);
                    $fileName = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();
                    $size = $uploadedFile->getSize();

                    if(!in_array($uploadedFile->guessExtension(), ['jpg', 'jpeg', 'png', 'gif'])) {
                        throw new HttpException(400, 'La miniature doit être une image de type jpg, jpeg, png ou gif');
                    }

                    // Déplacer le fichier vers le répertoire souhaité
                    $uploadedFile->move(
                        'images/book',
                        $fileName
                    );

                    $Ressource->setMiniature($fileName);

                    // Créer une nouvelle entité Image
                    $image = new Fichier();
                    $image->setNom($fileName);

                    // Vérifier si le fichier existe avant de récupérer sa taille
                    if (file_exists('images/book/' . $fileName)) {
                        $image->setTaille($size);
                    } else {
                        // Handle the case where file doesn't exist
                        // You can set a default size or handle it as per your application's requirements
                        $image->setTaille(0);
                    }
                    $image->setCreation(new \DateTimeImmutable());

                    // Ajouter l'image à la collection d'images du livre
                    $Ressource->addFichier($image);
                }
            }
        }

        if(isset($files)) {
            foreach ($files as $uploadedFile) {
                if ($uploadedFile instanceof UploadedFile) {
                    // Générer un nom de fichier unique
                    $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFilename = $slugger->slug($originalFilename);
                    $fileName = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();
                    $size = $uploadedFile->getSize();

                    if (!in_array($uploadedFile->guessExtension(), ['pdf', 'doc', 'docx', 'odt', 'txt', 'jpg', 'jpeg', 'gif'])) {
                        throw new HttpException(400, 'Les fichiers doivent être de type pdf, doc, docx, odt, txt, jpg, jpeg ou gif');
                    }


                    // Déplacer le fichier vers le répertoire souhaité
                    $uploadedFile->move(
                        'images/book',
                        $fileName
                    );

                    // Créer une nouvelle entité Image
                    $image = new Fichier();
                    $image->setNom($fileName);

                    // Vérifier si le fichier existe avant de récupérer sa taille
                    if (file_exists('images/book/' . $fileName)) {
                        $image->setTaille($size);
                    } else {
                        // Handle the case where file doesn't exist
                        // You can set a default size or handle it as per your application's requirements
                        $image->setTaille(0);
                    }
                    $image->setCreation(new \DateTimeImmutable());

                    // Ajouter l'image à la collection d'images du livre
                    $Ressource->addFichier($image);
                }
            }
        }

        // Enregistrer le livre avec toutes les images associées
        $entityManager->persist($Ressource);

        // Flush tous les changements une fois que toutes les images ont été traitées
        $entityManager->flush();

        return $this->json(['message' => 'Files uploaded successfully'], Response::HTTP_CREATED);
    }
    public function uploadFilesEdit(Request $request, SluggerInterface $slugger, PersistenceManagerRegistry $doctrine): Response
    {
        // Récupérer tous les fichiers envoyés
        $files = $request->files->get('fichiers');

        $id = $request->request->get('idRessource');

        if($request->files->get('miniature') !== null){
            $miniature = $request->files->get('miniature');
        }



        // Initialiser l'entityManager en dehors de la boucle
        $entityManager = $doctrine->getManager();

        $Ressource = $doctrine->getRepository(Ressource::class)->find($id);

        if(isset($miniature)){
            foreach($miniature as $uploadedFile){
                if ($uploadedFile instanceof UploadedFile) {
                    // Générer un nom de fichier unique
                    $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFilename = $slugger->slug($originalFilename);
                    $fileName = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();
                    $size = $uploadedFile->getSize();

                    if(!in_array($uploadedFile->guessExtension(), ['jpg', 'jpeg', 'png', 'gif'])) {
                        throw new HttpException(400, 'La miniature doit être une image de type jpg, jpeg, png ou gif');
                    }

                    // Déplacer le fichier vers le répertoire souhaité
                    $uploadedFile->move(
                        'images/book',
                        $fileName
                    );

                    $Ressource->setMiniature($fileName);

                    // Créer une nouvelle entité Image
                    $image = new Fichier();
                    $image->setNom($fileName);

                    // Vérifier si le fichier existe avant de récupérer sa taille
                    if (file_exists('images/book/' . $fileName)) {
                        $image->setTaille($size);
                    } else {
                        // Handle the case where file doesn't exist
                        // You can set a default size or handle it as per your application's requirements
                        $image->setTaille(0);
                    }
                    $image->setCreation(new \DateTimeImmutable());

                    // Ajouter l'image à la collection d'images du livre
                    $Ressource->addFichier($image);
                }
            }
        }

        if(isset($files)) {
            foreach ($files as $uploadedFile) {
                if ($uploadedFile instanceof UploadedFile) {
                    // Générer un nom de fichier unique
                    $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFilename = $slugger->slug($originalFilename);
                    $fileName = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();
                    $size = $uploadedFile->getSize();

                    if (!in_array($uploadedFile->guessExtension(), ['pdf', 'doc', 'docx', 'odt', 'txt', 'jpg', 'jpeg', 'gif'])) {
                        throw new HttpException(400, 'Les fichiers doivent être de type pdf, doc, docx, odt, txt, jpg, jpeg ou gif');
                    }


                    // Déplacer le fichier vers le répertoire souhaité
                    $uploadedFile->move(
                        'images/book',
                        $fileName
                    );

                    // Créer une nouvelle entité Image
                    $image = new Fichier();
                    $image->setNom($fileName);

                    // Vérifier si le fichier existe avant de récupérer sa taille
                    if (file_exists('images/book/' . $fileName)) {
                        $image->setTaille($size);
                    } else {
                        // Handle the case where file doesn't exist
                        // You can set a default size or handle it as per your application's requirements
                        $image->setTaille(0);
                    }
                    $image->setCreation(new \DateTimeImmutable());

                    // Ajouter l'image à la collection d'images du livre
                    $Ressource->addFichier($image);
                }
            }
        }

        // Enregistrer le livre avec toutes les images associées
        $entityManager->persist($Ressource);

        // Flush tous les changements une fois que toutes les images ont été traitées
        $entityManager->flush();

        return $this->json(['message' => 'Files uploaded successfully Upload EDIT'], Response::HTTP_CREATED);
    }
}
