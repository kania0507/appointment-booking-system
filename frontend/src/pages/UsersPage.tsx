import { useEffect, useState } from 'react';
import type { User } from '../types/User';
import { getUsers } from '../services/userService';
import { UserForm } from '../components/UserForm';
import { Button } from '../components/ui/Button';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  async function loadUsers() {
    try {
      setError(null);

      const users = await getUsers();

      setUsers(users);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleUserSaved(savedUser: User) {
    setUsers((currentUsers) => {
      const exists = currentUsers.some(
        (user) => user.id === savedUser.id,
      );

      if (exists) {
        return currentUsers.map((user) =>
          user.id === savedUser.id ? savedUser : user,
        );
      }

      return [...currentUsers, savedUser];
    });

    setEditingUser(null);
  }

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="page">
      <section className="card">
        <UserForm
          key={editingUser?.id ?? 'create'}
          user={editingUser ?? undefined}
          onSaved={handleUserSaved}
          onCancel={() => setEditingUser(null)}
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

                <Button
                  type="button"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}