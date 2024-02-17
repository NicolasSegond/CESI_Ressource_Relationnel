<?php

namespace App\Entity;

use App\Repository\StatutRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StatutRepository::class)]
class Statut
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $nomStatut = null;

    #[ORM\OneToMany(mappedBy: 'statut', targetEntity: Ressource::class)]
    private Collection $Ressource;

    public function __construct()
    {
        $this->Ressource = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomStatut(): ?string
    {
        return $this->nomStatut;
    }

    public function setNomStatut(string $nomStatut): static
    {
        $this->nomStatut = $nomStatut;

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
            $ressource->setStatut($this);
        }

        return $this;
    }

    public function removeRessource(Ressource $ressource): static
    {
        if ($this->Ressource->removeElement($ressource)) {
            // set the owning side to null (unless already changed)
            if ($ressource->getStatut() === $this) {
                $ressource->setStatut(null);
            }
        }

        return $this;
    }
}
