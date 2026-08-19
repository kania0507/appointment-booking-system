export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = await response.json();

    return body.error ?? 'Wystąpił błąd.';
  } catch {
    return 'Wystąpił błąd.';
  }
}

export async function login(
  data: LoginData,
): Promise<AuthUser> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ApiError(
      await parseError(response),
      response.status,
    );
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new ApiError(
      await parseError(response),
      response.status,
    );
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch('/api/me');

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError(
      await parseError(response),
      response.status,
    );
  }

  return response.json();
}

export async function register(
  data: RegisterData,
): Promise<AuthUser> {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ApiError(
      await parseError(response),
      response.status,
    );
  }

  return response.json();
}