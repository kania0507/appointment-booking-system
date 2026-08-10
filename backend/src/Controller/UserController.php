<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Dto\CreateUserRequest;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController
{
    public function __construct(
        private UserService $userService,
        private ValidatorInterface $validator,
    ) {
    }

    #[Route('/api/users', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = $request->toArray();

        $dto = new CreateUserRequest();
        $dto->email = $data['email'] ?? null;
        $dto->firstName = $data['firstName'] ?? null;
        $dto->lastName = $data['lastName'] ?? null;

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            $validationErrors = [];

            foreach ($errors as $error) {
                $validationErrors[] = [
                    'field' => $error->getPropertyPath(),
                    'message' => $error->getMessage(),
                ];
            }

            return new JsonResponse([
                'errors' => $validationErrors,
            ], 400);
        }

        $user = $this->userService->createUser(
            $dto->email,
            $dto->firstName,
            $dto->lastName,
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