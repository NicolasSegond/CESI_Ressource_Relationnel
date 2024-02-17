<?php

namespace App\Repository;

use App\Entity\TypeProgression;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TypeProgression>
 *
 * @method TypeProgression|null find($id, $lockMode = null, $lockVersion = null)
 * @method TypeProgression|null findOneBy(array $criteria, array $orderBy = null)
 * @method TypeProgression[]    findAll()
 * @method TypeProgression[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TypeProgressionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TypeProgression::class);
    }

//    /**
//     * @return TypeProgression[] Returns an array of TypeProgression objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?TypeProgression
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
