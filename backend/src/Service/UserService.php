<?php

namespace App\Service;

use App\Dto\UpdateUserRequest;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function createUser(
        string $email,
        string $firstName,
        string $lastName,
    ): User {
        $user = new User();

        $user
            ->setEmail($email)
            ->setFirstName($firstName)
            ->setLastName($lastName)
            ->setRoles(['ROLE_CUSTOMER'])
            ->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    public function registerUser(
        string $email,
        string $firstName,
        string $lastName,
        string $password,
    ): User {
        $user = new User();

        $user
            ->setEmail($email)
            ->setFirstName($firstName)
            ->setLastName($lastName)
            ->setRoles(['ROLE_CUSTOMER'])
            ->setCreatedAt(new \DateTimeImmutable());

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $password,
        );

        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    public function getUsers(): array
    {
        return $this->userRepository->findAll();
    }

    public function getUser(int $id): ?User
    {
        return $this->userRepository->find($id);
    }

    public function updateUser(
        User $user,
        UpdateUserRequest $request,
    ): User {
        if ($request->email !== null) {
            $user->setEmail($request->email);
        }

        if ($request->firstName !== null) {
            $user->setFirstName($request->firstName);
        }

        if ($request->lastName !== null) {
            $user->setLastName($request->lastName);
        }

        $this->entityManager->flush();

        return $user;
    }

    public function deleteUser(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
}