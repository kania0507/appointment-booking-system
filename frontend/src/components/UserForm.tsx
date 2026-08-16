import { useState } from 'react';
import type { User } from '../types/User';
import {
  createUser,
  updateUser,
  ApiException,
} from '../services/userService';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface UserFormProps {
  user?: User;
  onSaved: (user: User) => void;
  onCancel?: () => void;
}

export function UserForm({
  user,
  onSaved,
  onCancel,
}: UserFormProps) {
  const [email, setEmail] = useState(user?.email ?? '');
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEdit = user !== undefined;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrors({});
    setSubmitting(true);

    try {
      const savedUser = isEdit
      ? await updateUser(user.id, {
          email,
          firstName,
          lastName,
        })
      : await createUser({
          email,
          firstName,
          lastName,
        });

      setEmail('');
      setFirstName('');
      setLastName('');

      onSaved(savedUser);
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
      <h2>{isEdit ? 'Edit user' : 'Create user'}</h2>

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
        {isEdit ? 'Save changes' : 'Create user'}
      </Button>

      {isEdit && onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
      )}
    </form>
  );
}