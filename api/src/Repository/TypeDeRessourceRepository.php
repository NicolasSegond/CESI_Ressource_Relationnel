<?php

namespace App\Repository;

use App\Entity\TypeDeRessource;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TypeDeRessource>
 *
 * @method TypeDeRessource|null find($id, $lockMode = null, $lockVersion = null)
 * @method TypeDeRessource|null findOneBy(array $criteria, array $orderBy = null)
 * @method TypeDeRessource[]    findAll()
 * @method TypeDeRessource[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TypeDeRessourceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TypeDeRessource::class);
    }

//    /**
//     * @return TypeDeRessource[] Returns an array of TypeDeRessource objects
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

//    public function findOneBySomeField($value): ?TypeDeRessource
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
