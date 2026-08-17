<?php

namespace App\Controller;

use App\Command\CreateAppointmentCommand;
use App\Entity\User;
use App\Service\AppointmentService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use App\Dto\UpdateAppointmentRequest;

class AppointmentController
{
    public function __construct(
        private AppointmentService $appointmentService,
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/appointments', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateAppointmentCommand $command
    ): JsonResponse {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->find($command->userId);

        if ($user === null) {
            return new JsonResponse(
                ['error' => 'User not found.'],
                404
            );
        }

        try {
            $appointment = $this->appointmentService->create(
                $user,
                new \DateTimeImmutable($command->startAt),
                new \DateTimeImmutable($command->endAt),
                $command->notes,
            );
        } catch (\DomainException $exception) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                409
            );
        } catch (\InvalidArgumentException $exception) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                400
            );
        }

        return new JsonResponse([
            'id' => $appointment->getId(),
            'userId' => $user->getId(),
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
    public function index(): JsonResponse
    {
        $appointments = $this->appointmentService->getAll();

        return new JsonResponse(
            array_map(
                fn ($appointment) => [
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
            )
        );
    }

    #[Route('/api/appointments/{id}', methods: ['PATCH'])]
    public function update(
        int $id,
        #[MapRequestPayload] UpdateAppointmentRequest $request,
    ): JsonResponse {
        $appointment = $this->entityManager
            ->getRepository(\App\Entity\Appointment::class)
            ->find($id);

        if ($appointment === null) {
            return new JsonResponse([
                'error' => 'Appointment not found.',
            ], 404);
        }

        $user = $this->entityManager
            ->getRepository(User::class)
            ->find($request->userId);

        if ($user === null) {
            return new JsonResponse([
                'error' => 'User not found.',
            ], 404);
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
            'startAt' => $appointment->getStartAt()?->format(\DateTimeInterface::ATOM),
            'endAt' => $appointment->getEndAt()?->format(\DateTimeInterface::ATOM),
            'status' => $appointment->getStatus(),
            'notes' => $appointment->getNotes(),
        ]);
    }
}