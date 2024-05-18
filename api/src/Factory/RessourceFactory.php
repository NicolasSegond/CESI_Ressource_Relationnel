<?php

namespace App\Factory;

use App\Entity\Ressource;
use App\Repository\CategorieRepository;
use App\Repository\RessourceRepository;
use App\Repository\StatutRepository;
use App\Repository\TypeDeRessourceRepository;
use App\Repository\TypeRelationRepository;
use App\Repository\VisibiliteRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Ressource>
 *
 * @method        Ressource|Proxy                     create(array|callable $attributes = [])
 * @method static Ressource|Proxy                     createOne(array $attributes = [])
 * @method static Ressource|Proxy                     find(object|array|mixed $criteria)
 * @method static Ressource|Proxy                     findOrCreate(array $attributes)
 * @method static Ressource|Proxy                     first(string $sortedField = 'id')
 * @method static Ressource|Proxy                     last(string $sortedField = 'id')
 * @method static Ressource|Proxy                     random(array $attributes = [])
 * @method static Ressource|Proxy                     randomOrCreate(array $attributes = [])
 * @method static RessourceRepository|RepositoryProxy repository()
 * @method static Ressource[]|Proxy[]                 all()
 * @method static Ressource[]|Proxy[]                 createMany(int $number, array|callable $attributes = [])
 * @method static Ressource[]|Proxy[]                 createSequence(iterable|callable $sequence)
 * @method static Ressource[]|Proxy[]                 findBy(array $attributes)
 * @method static Ressource[]|Proxy[]                 randomRange(int $min, int $max, array $attributes = [])
 * @method static Ressource[]|Proxy[]                 randomSet(int $number, array $attributes = [])
 */
final class RessourceFactory extends ModelFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct(
        private StatutRepository $statutRepository,
        private VisibiliteRepository $visibiliteRepository,
        private TypeDeRessourceRepository $typeDeRessource,
        private TypeRelationRepository $typeRelations,
        private CategorieRepository $categorie
    )
    {
        parent::__construct();
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function getDefaults(): array
    {
        $statut = $this->statutRepository->findOneBy(['id' => self::faker()->numberBetween(1, 3)]);
        $visibilite = $this->visibiliteRepository->findOneBy(['id' => self::faker()->numberBetween(1, 3)]);
        $type_ressources = $this->typeDeRessource->findAll();
        $type_relations = $this->typeRelations->findAll();
        $categories = $this->categorie->findAll();

        $randomTypeRessource = $type_ressources[array_rand($type_ressources)];
        $randomTypeRelation1 = $type_relations[array_rand($type_relations)];
        $randomTypeRelation2 = $type_relations[array_rand($type_relations)];
        $randomCategorie = $categories[array_rand($categories)];

        return [
            'contenu' => self::faker()->text(10000),
            'dateCreation' => self::faker()->dateTime(),
            'dateModification' => self::faker()->dateTime(),
            'miniature' => self::faker()->text(255),
            'nombreVue' => self::faker()->randomNumber(),
            'proprietaire' => UtilisateurFactory::new(),
            'titre' => self::faker()->text(255),
            'valide' => self::faker()->randomNumber(),
            'statut' => $statut,
            'visibilite' => $visibilite,
            'typeDeRessource' => $randomTypeRessource,
            'typeRelations' => [
                $randomTypeRelation1,
                $randomTypeRelation2
            ],
            'categorie' => $randomCategorie,
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            ->afterInstantiate(function(Ressource $ressource): void {
                $ressource->setProprietaire(
                    $ressource->getProprietaire()
                );
            })
            ;
    }

    protected static function getClass(): string
    {
        return Ressource::class;
    }
}
