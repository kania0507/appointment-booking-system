<?php

namespace App\Tests\Service;

use App\Repository\AppointmentRepository;
use App\Service\AppointmentService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class AppointmentServiceTest extends TestCase
{
    public function testCreateRejectsInvalidTimeRange(): void
    {
        $repository = $this->createMock(
            AppointmentRepository::class
        );

        $entityManager = $this->createMock(
            EntityManagerInterface::class
        );

        $service = new AppointmentService(
            $repository,
            $entityManager,
        );

        $this->expectException(\InvalidArgumentException::class);

        $service->create(
            $this->createMock(\App\Entity\User::class),
            new \DateTimeImmutable('2026-08-17 11:00:00'),
            new \DateTimeImmutable('2026-08-17 10:00:00'),
        );
    }

    public function testCreateCreatesAppointmentWhenThereIsNoConflict(): void
    {
        $repository = $this->createMock(
            AppointmentRepository::class
        );

        $entityManager = $this->createMock(
            EntityManagerInterface::class
        );

        $repository
            ->expects($this->once())
            ->method('findConflict')
            ->willReturn(null);

        $entityManager
            ->expects($this->once())
            ->method('persist');

        $entityManager
            ->expects($this->once())
            ->method('flush');

        $service = new AppointmentService(
            $repository,
            $entityManager,
        );

        $appointment = $service->create(
            $this->createMock(\App\Entity\User::class),
            new \DateTimeImmutable('2026-08-17 10:00:00'),
            new \DateTimeImmutable('2026-08-17 11:00:00'),
            'Pierwsza wizyta',
        );

        self::assertSame(
            'scheduled',
            $appointment->getStatus()
        );

        self::assertSame(
            'Pierwsza wizyta',
            $appointment->getNotes()
        );
    }

    public function testCreateRejectsConflictingAppointment(): void
    {
        $repository = $this->createMock(
            AppointmentRepository::class
        );

        $entityManager = $this->createMock(
            EntityManagerInterface::class
        );

        $existingAppointment = $this->createMock(
            \App\Entity\Appointment::class
        );

        $repository
            ->expects($this->once())
            ->method('findConflict')
            ->willReturn($existingAppointment);

        $entityManager
            ->expects($this->never())
            ->method('persist');

        $entityManager
            ->expects($this->never())
            ->method('flush');

        $service = new AppointmentService(
            $repository,
            $entityManager,
        );

        $this->expectException(\DomainException::class);

        $service->create(
            $this->createMock(\App\Entity\User::class),
            new \DateTimeImmutable('2026-08-17 10:30:00'),
            new \DateTimeImmutable('2026-08-17 11:30:00'),
        );
    }
}