<?php
// src/EventListener/UserListenerMailInscription.php
namespace App\EventListener;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\ApiResource\UtilisateurAPI;
use App\Entity\Utilisateur;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;

final class UserListenerMailInscription implements EventSubscriberInterface
{
    private $mailer;
    private $entityManager;
    private $userListenerRandomCode;
    public function __construct(MailerInterface $mailer, EntityManagerInterface $entityManager, UserListenerRandomCode $userListenerRandomCode)
    {
        $this->mailer = $mailer;
        $this->entityManager = $entityManager;
        $this->userListenerRandomCode = $userListenerRandomCode;
    }

    public function postPersist(ViewEvent $event)
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($user instanceof UtilisateurAPI && Request::METHOD_POST === $method) {
            $code = $this->userListenerRandomCode->getGeneratedCode();

            if ($code) {
                $this->sendConfirmationEmail($user, $code);
            } else {
                // Gérer le cas où le code n'a pas été généré
            }
        }
    }
    public function sendConfirmationEmail(UtilisateurAPI $user, $code)
    {
            $emailContent = '<!DOCTYPE html>
            <html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        .image_block img+div {
            display: none;
        }

        @media (max-width:700px) {

            .desktop_hide table.icons-inner,
            .row-2 .column-1 .block-3.button_block .alignment a,
            .row-2 .column-1 .block-3.button_block .alignment div,
            .social_block.desktop_hide .social-table {
                display: inline-block !important;
            }

            .icons-inner {
                text-align: center;
            }

            .icons-inner td {
                margin: 0 auto;
            }

            .mobile_hide {
                display: none;
            }

            .row-content {
                width: 100% !important;
            }

            .stack .column {
                width: 100%;
                display: block;
            }

            .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }

            .row-2 .column-1 .block-2.paragraph_block td.pad>div {
                text-align: left !important;
                font-size: 14px !important;
            }

            .row-2 .column-1 .block-1.heading_block h1,
            .row-2 .column-1 .block-3.button_block .alignment {
                text-align: left !important;
            }

            .row-2 .column-1 .block-1.heading_block h1 {
                font-size: 20px !important;
            }

            .row-2 .column-1 .block-4.paragraph_block td.pad>div {
                text-align: justify !important;
                font-size: 10px !important;
            }

            .row-2 .column-1 .block-3.button_block a,
            .row-2 .column-1 .block-3.button_block div,
            .row-2 .column-1 .block-3.button_block span {
                font-size: 14px !important;
                line-height: 28px !important;
            }

            .row-2 .column-1 {
                padding: 0 24px 48px !important;
            }

            .row-4 .column-1 {
                padding: 32px 16px 48px !important;
            }
        }
    </style>
</head>
<body style="background-color: #f8f6ff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td style="padding: 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #4626c7; color: #ffffff;">
                <tr>
                    <td align="center">
                        <img src="https://image.noelshack.com/fichiers/2024/08/3/1708554294-logo.png" alt="Logo" width="200">
                        <!--  <img src="http://127.0.0.1:8000/public/logo.png" alt="Logo" width="200"> -->
                    </td>
                </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                <tr>
                    <td>
                        <h1 style="color: #292929; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; line-height: 120%; margin: 0;">Confirmer votre inscription</h1>
                        <p>Bienvenue  ' . $user->nom .' '. $user->prenom . ' sur Ressources relationnelles, la plateforme pour améliorer vos relations!</p>
                        <p>Cliquez sur le bouton ci-dessous pour valider votre inscription.</p>
                        <p>
                           <a href="http://localhost:3000/verifCode/' . $user->id . '/' . $code . '" style="background-color: #03989e; color: #ffffff; display: inline-block; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmer l\'inscription</a>
                        </p>
                        <p>En confirmant votre abonnement, vous rejoindrez une communauté de personnes partageant les mêmes idées et passionnées par les relations. Préparez-vous à rester informé et inspiré !</p>
                    </td>
                </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ba4848; color: #ffffff; padding: 20px;">
                <tr>
                    <td align="center">
                        <!-- Liens vers les réseaux sociaux -->
                    </td>
                </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; color: #000000; padding: 20px;">
                <tr>
                    <td align="center">
                        <p>Vous avez reçu cet e-mail parce que vous êtes abonné à ce site.</p>
                        <p>Si vous pensez l\'avoir reçu par erreur ou si vous souhaitez vous désinscrire, <a href="https://example.com/unsubscribe" style="color: #ffffff; text-decoration: none;">cliquez ici</a>.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</html>';

            $email = (new Email())
                ->from('ressourcerelationnel@gmail.com')
                ->to($user->email)
                ->subject('Bienvenue')
                ->html($emailContent);

            $this->mailer->send($email);
        }
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['postPersist', EventPriorities::POST_WRITE],
        ];
    }
}
