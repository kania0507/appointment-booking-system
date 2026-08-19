<?php

namespace App\Controller;

use App\Command\CreateAppointmentCommand;
use App\Dto\UpdateAppointmentRequest;
use App\Entity\Appointment;
use App\Entity\User;
use App\Service\AppointmentService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AppointmentController
{
    public function __construct(
        private AppointmentService $appointmentService,
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/appointments', methods: ['POST'])]
    public function create(
        #[CurrentUser] ?User $user,
        #[MapRequestPayload] CreateAppointmentCommand $command,
    ): JsonResponse {
        if ($user === null) {
            return new JsonResponse([
                'error' => 'Not authenticated.',
            ], 401);
        }

        try {
            $appointment = $this->appointmentService->create(
                $user,
                new \DateTimeImmutable($command->startAt),
                new \DateTimeImmutable($command->endAt),
                $command->notes,
            );
        } catch (\DomainException $exception) {
            return new JsonResponse([
                'error' => $exception->getMessage(),
            ], 409);
        } catch (\InvalidArgumentException $exception) {
            return new JsonResponse([
                'error' => $exception->getMessage(),
            ], 400);
        }

        return new JsonResponse([
            'id' => $appointment->getId(),
            'userId' => $appointment->getUser()?->getId(),
            'startAt' => $appointment
                ->getStartAt()
                ?->format(\DateTimeInterface::ATOM),
            'endAt' => $appointment
                ->getEndAt()
                ?->format(\DateTimeInterface::ATOM),
            'status' => $appointment->getStatus(),
            'notes' => $appointment->getNotes(),
        ], 201);
    }

    #[Route('/api/appointments', methods: ['GET'])]
    public function index(
        #[CurrentUser] ?User $user,
    ): JsonResponse {
        if ($user === null) {
            return new JsonResponse([
                'error' => 'Not authenticated.',
            ], 401);
        }

        $appointments = $this->appointmentService->getForUser($user);

        return new JsonResponse(array_map(
            fn (Appointment $appointment) => [
                'id' => $appointment->getId(),
                'userId' => $appointment->getUser()?->getId(),
                'startAt' => $appointment
                    ->getStartAt()
                    ?->format(\DateTimeInterface::ATOM),
                'endAt' => $appointment
                    ->getEndAt()
                    ?->format(\DateTimeInterface::ATOM),
                'status' => $appointment->getStatus(),
                'notes' => $appointment->getNotes(),
            ],
            $appointments,
        ));
    }

    #[Route('/api/appointments/{id}', methods: ['PATCH'])]
    public function update(
        int $id,
        #[CurrentUser] ?User $user,
        #[MapRequestPayload] UpdateAppointmentRequest $request,
    ): JsonResponse {
        if ($user === null) {
            return new JsonResponse([
                'error' => 'Not authenticated.',
            ], 401);
        }

        $appointment = $this->entityManager
            ->getRepository(Appointment::class)
            ->find($id);

        if ($appointment === null) {
            return new JsonResponse([
                'error' => 'Appointment not found.',
            ], 404);
        }

        if ($appointment->getUser()?->getId() !== $user->getId()) {
            return new JsonResponse([
                'error' => 'You cannot modify this appointment.',
            ], 403);
        }

        try {
            $appointment = $this->appointmentService->update(
                $appointment,
                $user,
                $request,
            );
        } catch (\DomainException $exception) {
            return new JsonResponse([
                'error' => $exception->getMessage(),
            ], 409);
        } catch (\InvalidArgumentException $exception) {
            return new JsonResponse([
                'error' => $exception->getMessage(),
            ], 400);
        }

        return new JsonResponse([
            'id' => $appointment->getId(),
            'userId' => $appointment->getUser()?->getId(),
            'startAt' => $appointment
                ->getStartAt()
                ?->format(\DateTimeInterface::ATOM),
            'endAt' => $appointment
                ->getEndAt()
                ?->format(\DateTimeInterface::ATOM),
            'status' => $appointment->getStatus(),
            'notes' => $appointment->getNotes(),
        ]);
    }
}