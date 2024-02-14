<?php

namespace App\Mapper;

use App\ApiResource\UtilisateurAPI;
use App\Entity\Utilisateur;
use App\Repository\UtilisateurRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfonycasts\MicroMapper\AsMapper;
use Symfonycasts\MicroMapper\MapperInterface;

#[AsMapper(from: UtilisateurAPI::class, to: Utilisateur::class)]
class UtilisateurApiToEntityMapper implements MapperInterface
{
    public function __construct(
        private UtilisateurRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
    )
    {
        // Initialise les dépendances nécessaires au fonctionnement du mapper.
    }

    public function load(object $from, string $toClass, array $context): object
    {
        // Obtient le DTO utilisateur à partir duquel charger l'entité.
        $dto = $from;
        assert($dto instanceof UtilisateurAPI);

        // Charge l'entité utilisateur existante ou crée une nouvelle instance.
        $userEntity = $dto->id ? $this->userRepository->find($dto->id) : new Utilisateur();
        // Si l'entité utilisateur n'existe pas, lance une exception.
        if(!$userEntity){
            throw new \Exception('User not found');
        }

        // Retourne l'entité utilisateur.
        return $userEntity;
    }

    public function populate(object $from, object $to, array $context): object
    {
        // Obtient le DTO utilisateur à partir duquel mettre à jour l'entité.
        $dto = $from;
        assert($dto instanceof UtilisateurAPI);

        // Obtient l'entité utilisateur
        $entity = $to;
        assert($entity instanceof Utilisateur);

        // Remplit les propriétés de l'entité avec les valeurs du DTO.
        $entity->setEmail($dto->email);

        if ($dto->password !== null) {
            // Vérifier si le nouveau mot de passe est différent du mot de passe actuel
            if ($dto->password !== $entity->getPassword()) {
                // Régénérer le hachage du mot de passe
                $entity->setPassword($this->passwordHasher->hashPassword($entity, $dto->password));
            }
        }

        $entity->setNom($dto->nom);

        $entity->setPrenom($dto->prenom);

        $entity->setCode($dto->code);

        $entity->setVerif($dto->verif);

        $entity->setRoles($dto->roles);

        // Retourne l'entité utilisateur mise à jour.
        return $entity;
    }
}