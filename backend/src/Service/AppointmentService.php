<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\EntityManagerInterface;

class AppointmentService
{
    public function __construct(
        private AppointmentRepository $appointmentRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function create(
        User $user,
        \DateTimeImmutable $startAt,
        \DateTimeImmutable $endAt,
        ?string $notes = null,
    ): Appointment {
        if ($startAt >= $endAt) {
            throw new \InvalidArgumentException(
                'Appointment start time must be before end time.'
            );
        }

        $conflict = $this->appointmentRepository->findConflict(
            $user,
            $startAt,
            $endAt,
        );

        if ($conflict !== null) {
            throw new \DomainException(
                'Appointment conflicts with an existing appointment.'
            );
        }

        $appointment = new Appointment();

        $appointment->setUser($user);
        $appointment->setStartAt($startAt);
        $appointment->setEndAt($endAt);
        $appointment->setStatus('scheduled');
        $appointment->setNotes($notes);
        $appointment->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($appointment);
        $this->entityManager->flush();

        return $appointment;
    }

    public function getAll(): array
    {
        return $this->appointmentRepository->findAllAppointments();
    }
}