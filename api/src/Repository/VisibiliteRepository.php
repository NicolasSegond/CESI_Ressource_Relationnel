<?php

namespace App\Repository;

use App\Entity\Visibilite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Visibilite>
 *
 * @method Visibilite|null find($id, $lockMode = null, $lockVersion = null)
 * @method Visibilite|null findOneBy(array $criteria, array $orderBy = null)
 * @method Visibilite[]    findAll()
 * @method Visibilite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VisibiliteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Visibilite::class);
    }

//    /**
//     * @return VisibiliteAPI[] Returns an array of VisibiliteAPI objects
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

//    public function findOneBySomeField($value): ?VisibiliteAPI
//    {
//        return $this->createQueryBuilder('v')
//            ->andWhere('v.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
