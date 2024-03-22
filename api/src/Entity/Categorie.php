<?php

namespace App\Entity;

use App\Repository\CategorieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategorieRepository::class)]
class Categorie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $nom = null;

    #[ORM\OneToMany(mappedBy: 'categorie', targetEntity: Ressource::class)]
    private Collection $Ressource;

    public function __construct()
    {
        $this->Ressource = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

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
            $ressource->setCategorie($this);
        }

        return $this;
    }

    public function removeRessource(Ressource $ressource): static
    {
        if ($this->Ressource->removeElement($ressource)) {
            // set the owning side to null (unless already changed)
            if ($ressource->getCategorie() === $this) {
                $ressource->setCategorie(null);
            }
        }

        return $this;
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->nom
        ];
    }
}
