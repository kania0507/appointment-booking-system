import { useState } from 'react';
import { createUser, ApiException } from '../services/userService';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

export function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});
    setSubmitting(true);

    try {
      await createUser({
        email,
        firstName,
        lastName,
      });

      setEmail('');
      setFirstName('');
      setLastName('');

      onUserCreated();
    } catch (error) {
      if (error instanceof ApiException) {
        const fieldErrors: Record<string, string> = {};

        for (const apiError of error.errors) {
          if (apiError.field) {
            fieldErrors[apiError.field] = apiError.message;
          }
        }

        setErrors(fieldErrors);
      } else {
        setErrors({
          form: 'Something went wrong. Please try again.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create user</h2>

      {errors.form && <p>{errors.form}</p>}

      <Input
        label="Email"
        type="email"
        value={email}
        error={errors.email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Input
        label="First name"
        type="text"
        value={firstName}
        error={errors.firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />

      <Input
        label="Last name"
        type="text"
        value={lastName}
        error={errors.lastName}
        onChange={(event) => setLastName(event.target.value)}
      />

      <Button type="submit" loading={submitting}>
        Create user
      </Button>
    </form>
  );
}