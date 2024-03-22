<?php

// src/Controller/PublicController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class PublicController extends AbstractController
{
    #[Route('/public/{filename}', name: 'public_assets')]
    public function index($filename)
    {
        $filePath = $this->getParameter('kernel.project_dir') . '/public/' . $filename;

        if (!file_exists($filePath)) {
            throw $this->createNotFoundException('The file does not exist');
        }

        $response = new BinaryFileResponse($filePath);
        $response->headers->set('Content-Type', mime_content_type($filePath));
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_INLINE);

        return $response;
    }
}
