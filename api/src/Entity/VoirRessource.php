<?php

namespace App\Entity;

use App\Repository\VoirRessourceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VoirRessourceRepository::class)]
class VoirRessource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Utilisateur::class, inversedBy: 'voirRessources')]
    private Collection $Utilisateur;

    #[ORM\ManyToOne(targetEntity: Ressource::class, inversedBy: 'voirRessources')]
    private Collection $Ressource;

    public function __construct()
    {
        $this->Utilisateur = new ArrayCollection();
        $this->Ressource = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Utilisateur>
     */
    public function getUtilisateur(): Collection
    {
        return $this->Utilisateur;
    }

    public function addUtilisateur(Utilisateur $utilisateur): static
    {
        if (!$this->Utilisateur->contains($utilisateur)) {
            $this->Utilisateur->add($utilisateur);
        }

        return $this;
    }

    public function removeUtilisateur(Utilisateur $utilisateur): static
    {
        $this->Utilisateur->removeElement($utilisateur);

        return $this;
    }

    /**
     * @return Collection<int, Ressource>
     */
    public function getRessource(): Collection
    {
        return $this->Ressource;
    }

    public function addRessource(Ressource $ressource): static
    {
        if (!$this->Ressource->contains($ressource)) {
            $this->Ressource->add($ressource);
        }

        return $this;
    }

    public function removeRessource(Ressource $ressource): static
    {
        $this->Ressource->removeElement($ressource);

        return $this;
    }
}
