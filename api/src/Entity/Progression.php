<?php

namespace App\Entity;

use App\Repository\ProgressionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProgressionRepository::class)]
class Progression
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'progressions')]
    private ?TypeProgression $TypeProgression = null;

    #[ORM\ManyToOne(inversedBy: 'progressions')]
    private ?Utilisateur $Utilisateur = null;

    #[ORM\ManyToOne(inversedBy: 'progressions')]
    private ?Ressource $Ressource = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeProgression(): ?TypeProgression
    {
        return $this->TypeProgression;
    }

    public function setTypeProgression(?TypeProgression $TypeProgression): static
    {
        $this->TypeProgression = $TypeProgression;

        return $this;
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
