<?php

namespace App\Entity;

use App\Repository\TypeDeRessourceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TypeDeRessourceRepository::class)]
class TypeDeRessource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $libelle = null;

    #[ORM\OneToMany(mappedBy: 'typeDeRessource', targetEntity: Ressource::class)]
    private Collection $Ressource;

    public function __construct()
    {
        $this->Ressource = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

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
            $ressource->setTypeDeRessource($this);
        }

        return $this;
    }

    public function removeRessource(Ressource $ressource): static
    {
        if ($this->Ressource->removeElement($ressource)) {
            // set the owning side to null (unless already changed)
            if ($ressource->getTypeDeRessource() === $this) {
                $ressource->setTypeDeRessource(null);
            }
        }

        return $this;
    }
}
