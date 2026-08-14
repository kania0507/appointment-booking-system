import type { User } from '../types/User';

const API_URL = '/api';

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
}


export interface ApiError {
  message: string;
  field?: string;
}

export class ApiException extends Error {
  errors: ApiError[];

  constructor(errors: ApiError[]) {
    super('API request failed');
    this.errors = errors;
  }
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json();

    throw new ApiException(
      body.errors ?? [{ message: 'Failed to create user' }]
    );
  }

  return response.json();
}