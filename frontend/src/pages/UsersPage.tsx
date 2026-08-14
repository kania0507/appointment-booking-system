import { useEffect, useState } from 'react';
import type { User } from '../types/User';
import { getUsers } from '../services/userService';
import { CreateUserForm } from '../components/CreateUserForm';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="page">
      <section className="card">
        <CreateUserForm
            onUserCreated={() => {
                getUsers().then(setUsers);
            }}
            />
        </section>

      <h1>Users</h1>

    <section className="card">
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} — {user.email}
            </li>
          ))}
        </ul>
      )}
      </section>
    </main>
  );
}