<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Dto\CreateUserRequest;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use App\Dto\UpdateUserRequest;

class UserController
{
    public function __construct(
        private UserService $userService,
    ) {
    }

   #[Route('/api/users', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateUserRequest $request
    ): JsonResponse {
        $user = $this->userService->createUser(
            $request->email,
            $request->firstName,
            $request->lastName,
        );

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
        ], 201);
    }

    #[Route('/api/users', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $users = $this->userService->getUsers();

        return new JsonResponse(array_map(
            static fn (User $user) => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
            ],
            $users
        ));
    }


    #[Route('/api/users/{id}', methods: ['GET'])]
    public function get(int $id): JsonResponse
    {
        $user = $this->userService->getUser($id);

        if ($user === null) {
            return new JsonResponse([
                'error' => 'User not found',
            ], 404);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
        ]);
    }

    #[Route('/api/users/{id}', methods: ['PATCH'])]
    public function update(
        int $id,
        #[MapRequestPayload] UpdateUserRequest $request,
    ): JsonResponse {
        $user = $this->userService->getUser($id);

        if ($user === null) {
            return new JsonResponse([
                'error' => 'User not found',
            ], 404);
        }

        $user = $this->userService->updateUser(
            $user,
            $request,
        );

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
        ]);
    }

    #[Route('/api/users/{id}', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->userService->getUser($id);

        if ($user === null) {
            return new JsonResponse([
                'error' => 'User not found',
            ], 404);
        }

        $this->userService->deleteUser($user);

        return new JsonResponse(null, 204);
    }

}