<?php

namespace App\Repository;

use App\Entity\Appointment;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Appointment>
 */
class AppointmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointment::class);
    }

    public function findConflict(
        User $user,
        \DateTimeImmutable $startAt,
        \DateTimeImmutable $endAt,
        ?Appointment $excludeAppointment = null,
    ): ?Appointment {
        $queryBuilder = $this->createQueryBuilder('a')
            ->andWhere('a.user = :user')
            ->andWhere('a.startAt < :endAt')
            ->andWhere('a.endAt > :startAt')
            ->setParameter('user', $user)
            ->setParameter('startAt', $startAt)
            ->setParameter('endAt', $endAt)
            ->setMaxResults(1);

        if ($excludeAppointment !== null) {
            $queryBuilder
                ->andWhere('a != :excludeAppointment')
                ->setParameter('excludeAppointment', $excludeAppointment);
        }

        return $queryBuilder
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllAppointments(): array
    {
        return $this->findBy([], ['startAt' => 'ASC']);
    }

    public function findAppointmentsByUser(User $user): array
    {
        return $this->findBy(
            ['user' => $user],
            ['startAt' => 'ASC'],
        );
    }
}