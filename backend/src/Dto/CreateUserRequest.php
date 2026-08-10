<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateUserRequest
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public ?string $email;

    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    public ?string $firstName;

    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    public ?string $lastName;
}