<?php

namespace App\Entity;

use App\Repository\RessourceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[ORM\Entity(repositoryClass: RessourceRepository::class)]
class Ressource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $miniature = null;

    #[ORM\Column(length: 10000)]
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

    #[ORM\ManyToMany(targetEntity: TypeRelation::class, mappedBy: 'Ressource', cascade: ['persist'], orphanRemoval: true)]
    private Collection $typeRelations;

    #[ORM\ManyToOne(inversedBy: 'Ressource')]
    private ?Categorie $categorie = null;

    #[ORM\OneToMany(mappedBy: 'Ressource', targetEntity: Commentaire::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $commentaires;

    #[ORM\OneToMany(mappedBy: 'Ressource', targetEntity: Progression::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $progressions;

    #[ORM\OneToMany(mappedBy: 'ressource', targetEntity: Fichier::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $fichiers;

    #[ORM\ManyToMany(targetEntity: Utilisateur::class, inversedBy: 'ressources')]
    #[ORM\JoinTable(name: 'voirRessource')]
    private Collection $voirRessource;

    #[ORM\Column]
    private ?bool $valide = false;

    public function __construct()
    {
        $this->commentaires = new ArrayCollection();
        $this->progressions = new ArrayCollection();
        $this->typeRelations = new ArrayCollection();
        $this->fichiers = new ArrayCollection();
        $this->voirRessource = new ArrayCollection();
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

    public function getTypeRelations(): Collection
    {
        return $this->typeRelations;
    }

    public function addTypeRelation(TypeRelation $typeRelation): static
    {
        if (!$this->typeRelations->contains($typeRelation)) {
            $this->typeRelations->add($typeRelation);
            $typeRelation->addRessource($this);
        }

        return $this;
    }

    public function removeTypeRelation(TypeRelation $typeRelation): static
    {
        if ($this->typeRelations->removeElement($typeRelation)) {
            $typeRelation->removeRessource($this);
        }

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

    /**
     * @return Collection<int, Fichier>
     */
    public function getFichiers(): Collection
    {
        return $this->fichiers;
    }

    public function addFichier(Fichier $fichier): static
    {
        if (!$this->fichiers->contains($fichier)) {
            $this->fichiers->add($fichier);
            $fichier->setRessource($this);
        }

        return $this;
    }

    public function removeFichier(Fichier $fichier): static
    {
        if ($this->fichiers->removeElement($fichier)) {
            // set the owning side to null (unless already changed)
            if ($fichier->getRessource() === $this) {
                $fichier->setRessource(null);
            }
        }

        return $this;
    }

    public function getMiniature(): ?string
    {
        return $this->miniature;
    }

    public function setMiniature(?string $miniature): void
    {
        $this->miniature = $miniature;
    }

    public function toArray(): array
    {
        $commentaires = [];
        foreach ($this->commentaires as $commentaire) {
            $commentaires[] = $commentaire->toArray();
        }

        $progressions = [];
        foreach ($this->progressions as $progression) {
            $progressions[] = $progression->toArray();
        }

        $typeRelations = [];
        foreach ($this->typeRelations as $typeRelation) {
            $typeRelations[] = $typeRelation->toArray();
        }

        $fichiers = [];
        foreach ($this->fichiers as $fichier) {
            $fichiers[] = $fichier->toArray();
        }

        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'miniature' => $this->miniature,
            'contenu' => $this->contenu,
            'dateCreation' => $this->dateCreation,
            'dateModification' => $this->dateModification,
            'nombreVue' => $this->nombreVue,
            'proprietaire' => ($this->proprietaire) ? $this->proprietaire->toArray() : null,
            'typeDeRessource' => ($this->typeDeRessource) ? $this->typeDeRessource->toArray() : null,
            'typeRelations' => $typeRelations,
            'categorie' => ($this->categorie) ? $this->categorie->toArray() : null,
            'commentaires' => $commentaires,
            'progressions' => $progressions,
            'fichier' => $fichiers,
        ];
    }

    /**
     * @return Collection<int, Utilisateur>
     */
    public function getVoirRessource(): Collection
    {
        return $this->voirRessource;
    }

    public function addVoirRessource(Utilisateur $voirRessource): static
    {
        if (!$this->voirRessource->contains($voirRessource)) {
            $this->voirRessource->add($voirRessource);
        }

        return $this;
    }

    public function removeVoirRessource(Utilisateur $voirRessource): static
    {
        $this->voirRessource->removeElement($voirRessource);

        return $this;
    }

    public function getValide(): ?int
    {
        return $this->valide;
    }

    public function setValide(int $valide): static
    {
        $this->valide = $valide;

        return $this;
    }
}
