<?php

namespace App\Repository;

use App\Entity\VoirRessource;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VoirRessource>
 *
 * @method VoirRessource|null find($id, $lockMode = null, $lockVersion = null)
 * @method VoirRessource|null findOneBy(array $criteria, array $orderBy = null)
 * @method VoirRessource[]    findAll()
 * @method VoirRessource[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VoirRessourceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VoirRessource::class);
    }

//    /**
//     * @return VoirRessource[] Returns an array of VoirRessource objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('v.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?VoirRessource
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
