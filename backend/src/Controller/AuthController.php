<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AuthController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(
        #[CurrentUser] ?User $user,
    ): JsonResponse {
        if ($user === null) {
            return new JsonResponse([
                'error' => 'Not authenticated.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(
        Request $request,
        TokenStorageInterface $tokenStorage,
    ): Response {
        $tokenStorage->setToken(null);

        if ($request->hasSession()) {
            $request->getSession()->invalidate();
        }

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}