<?php

namespace App\Command;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:user:set-test-password',
    description: 'Sets a password for an existing development user.',
)]
class SetTestUserPasswordCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED)
            ->addArgument('password', InputArgument::REQUIRED);
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output,
    ): int {
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');

        $user = $this->userRepository->findOneBy([
            'email' => $email,
        ]);

        if ($user === null) {
            $output->writeln(
                '<error>User not found.</error>'
            );

            return Command::FAILURE;
        }

        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $password,
            )
        );

        $user->setRoles(['ROLE_CUSTOMER']);

        $this->entityManager->flush();

        $output->writeln(
            sprintf(
                '<info>Password and ROLE_CUSTOMER set for %s.</info>',
                $email,
            )
        );

        return Command::SUCCESS;
    }
}