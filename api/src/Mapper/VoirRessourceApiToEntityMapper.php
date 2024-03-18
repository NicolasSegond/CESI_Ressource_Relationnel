<?php

namespace App\Mapper;


use App\ApiResource\VoirRessourceAPI;
use App\Entity\Categorie;
use App\Entity\Ressource;
use App\Entity\TypeRelation;
use App\Entity\Utilisateur;
use App\Entity\VoirRessource;
use App\Repository\VoirRessourceRepository;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;
use Symfonycasts\MicroMapper\MicroMapperInterface;

#[AsMapper(from: VoirRessourceAPI::class, to: VoirRessource::class)]
class VoirRessourceApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private VoirRessourceRepository $voirRessourceRepository,
        private MicroMapperInterface $microMapper,
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO VoirRessource à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof VoirRessourceAPI);

        // Charge l'statut VoirRessource existante ou crée une nouvelle instance.
        $statutEntity = $dto->id ? $this->voirRessourceRepository->find($dto->id) : new VoirRessource();
        // Si l'entité VoirRessource n'existe pas, lance une exception.
        if(!$statutEntity){
            throw new \Exception('Voir Ressource non trouvé');
        }

        // Retourne l'entité VoirRessource.
        return $statutEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO VoirRessource à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof VoirRessourceAPI);

        // Obtient l'entité VoirRessource.
        $entity = $to;
        assert($entity instanceof VoirRessource);


        $entity->setRessource($this->microMapper->map($dto->ressource, Ressource::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]));

        $entity->setUtilisateur($this->microMapper->map($dto->utilisateur, Utilisateur::class, [
            MicroMapperInterface::MAX_DEPTH => 0,
        ]));

        // Retourne l'entité VoirRessource mise à jour.
        return $entity;
    }
}
