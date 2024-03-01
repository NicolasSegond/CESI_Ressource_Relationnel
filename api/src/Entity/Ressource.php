<?php

namespace App\Entity;

use App\Repository\RessourceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RessourceRepository::class)]
class Ressource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 1000)]
    private ?string $contenu = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dateModification = null;

    #[ORM\Column]
    private ?int $nombreVue = null;

    #[ORM\ManyToOne(inversedBy: 'proprietaireRessource')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $proprietaire = null;

    #[ORM\ManyToOne(inversedBy: 'Ressource')]
    private ?Statut $statut = null;

    #[ORM\ManyToOne(inversedBy: 'Ressource')]
    private ?Visibilite $visibilite = null;

    #[ORM\ManyToOne(inversedBy: 'Ressource')]
    private ?TypeDeRessource $typeDeRessource = null;

    #[ORM\ManyToOne(inversedBy: 'Ressource')]
    private ?TypeRelation $typeRelation = null;

    #[ORM\ManyToOne(inversedBy: 'Ressource')]
    private ?Categorie $categorie = null;

    #[ORM\ManyToMany(targetEntity: VoirRessource::class, mappedBy: 'Ressource')]
    private Collection $voirRessources;

    #[ORM\OneToMany(mappedBy: 'Ressource', targetEntity: Commentaire::class)]
    private Collection $commentaires;

    #[ORM\OneToMany(mappedBy: 'Ressource', targetEntity: Progression::class)]
    private Collection $progressions;

    public function __construct()
    {
        $this->voirRessources = new ArrayCollection();
        $this->commentaires = new ArrayCollection();
        $this->progressions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }


    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function getDateModification(): ?\DateTimeInterface
    {
        return $this->dateModification;
    }

    public function setDateModification(\DateTimeInterface $dateModification): static
    {
        $this->dateModification = $dateModification;

        return $this;
    }

    public function getNombreVue(): ?int
    {
        return $this->nombreVue;
    }

    public function setNombreVue(int $nombreVue): static
    {
        $this->nombreVue = $nombreVue;

        return $this;
    }

    public function getProprietaire(): ?Utilisateur
    {
        return $this->proprietaire;
    }

    public function setProprietaire(?Utilisateur $proprietaire): static
    {
        $this->proprietaire = $proprietaire;

        return $this;
    }

    public function getStatut(): ?Statut
    {
        return $this->statut;
    }

    public function setStatut(?Statut $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getVisibilite(): ?Visibilite
    {
        return $this->visibilite;
    }

    public function setVisibilite(?Visibilite $visibilite): static
    {
        $this->visibilite = $visibilite;

        return $this;
    }

    public function getTypeDeRessource(): ?TypeDeRessource
    {
        return $this->typeDeRessource;
    }

    public function setTypeDeRessource(?TypeDeRessource $typeDeRessource): static
    {
        $this->typeDeRessource = $typeDeRessource;

        return $this;
    }

    public function getTypeRelation(): ?TypeRelation
    {
        return $this->typeRelation;
    }

    public function setTypeRelation(?TypeRelation $typeRelation): static
    {
        $this->typeRelation = $typeRelation;

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    /**
     * @return Collection<int, VoirRessource>
     */
    public function getVoirRessources(): Collection
    {
        return $this->voirRessources;
    }

    public function addVoirRessource(VoirRessource $voirRessource): static
    {
        if (!$this->voirRessources->contains($voirRessource)) {
            $this->voirRessources->add($voirRessource);
            $voirRessource->addRessource($this);
        }

        return $this;
    }

    public function removeVoirRessource(VoirRessource $voirRessource): static
    {
        if ($this->voirRessources->removeElement($voirRessource)) {
            $voirRessource->removeRessource($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Commentaire>
     */
    public function getCommentaires(): Collection
    {
        return $this->commentaires;
    }

    public function addCommentaire(Commentaire $commentaire): static
    {
        if (!$this->commentaires->contains($commentaire)) {
            $this->commentaires->add($commentaire);
            $commentaire->setRessource($this);
        }

        return $this;
    }

    public function removeCommentaire(Commentaire $commentaire): static
    {
        if ($this->commentaires->removeElement($commentaire)) {
            // set the owning side to null (unless already changed)
            if ($commentaire->getRessource() === $this) {
                $commentaire->setRessource(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Progression>
     */
    public function getProgressions(): Collection
    {
        return $this->progressions;
    }

    public function addProgression(Progression $progression): static
    {
        if (!$this->progressions->contains($progression)) {
            $this->progressions->add($progression);
            $progression->setRessource($this);
        }

        return $this;
    }

    public function removeProgression(Progression $progression): static
    {
        if ($this->progressions->removeElement($progression)) {
            // set the owning side to null (unless already changed)
            if ($progression->getRessource() === $this) {
                $progression->setRessource(null);
            }
        }

        return $this;
    }
}
