<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateAppointmentRequest
{
    #[Assert\NotNull]
    #[Assert\Positive]
    public ?int $userId = null;

    #[Assert\NotBlank]
    public ?string $startAt = null;

    #[Assert\NotBlank]
    public ?string $endAt = null;

    #[Assert\Length(max: 2000)]
    public ?string $notes = null;
}