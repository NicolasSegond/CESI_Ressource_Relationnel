<?php

namespace App\Entity;

use App\Repository\VoirRessourceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: VoirRessourceRepository::class)]
class VoirRessource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'voirRessources')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $Utilisateur = null;

    #[ORM\ManyToOne(inversedBy: 'voirRessources')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ressource $Ressource = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->Utilisateur;
    }

    public function setUtilisateur(?Utilisateur $Utilisateur): static
    {
        $this->Utilisateur = $Utilisateur;

        return $this;
    }

    public function getRessource(): ?Ressource
    {
        return $this->Ressource;
    }

    public function setRessource(?Ressource $Ressource): static
    {
        $this->Ressource = $Ressource;

        return $this;
    }
}
