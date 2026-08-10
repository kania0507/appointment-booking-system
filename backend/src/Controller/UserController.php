<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;

class UserController
{
    public function __construct(
        private UserService $userService,
    ) {
    }

    #[Route('/api/users', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = $request->toArray();

        $user = $this->userService->createUser(
            $data['email'],
            $data['firstName'],
            $data['lastName'],
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

}