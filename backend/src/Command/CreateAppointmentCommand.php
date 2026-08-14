<?php

namespace App\Command;

use Symfony\Component\Validator\Constraints as Assert;

class CreateAppointmentCommand
{
    #[Assert\NotNull]
    #[Assert\Positive]
    public ?int $userId = null;

    #[Assert\NotBlank]
    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/',
        message: 'Invalid datetime format.'
    )]
    public ?string $startAt = null;

    #[Assert\NotBlank]
    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/',
        message: 'Invalid datetime format.'
    )]
    public ?string $endAt = null;

    #[Assert\Length(max: 2000)]
    public ?string $notes = null;
}