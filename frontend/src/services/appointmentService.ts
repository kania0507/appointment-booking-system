export interface Appointment {
  id: number;
  userId: number;
  startAt: string;
  endAt: string;
  status: string;
  notes: string | null;
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await fetch('/api/appointments');

  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }

  return response.json();
} 

export interface CreateAppointmentData {
  userId: number;
  startAt: string;
  endAt: string;
  notes: string | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}


export async function createAppointment(
  data: CreateAppointmentData,
): Promise<Appointment> {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json();

    throw new ApiError(
      body.error ?? 'Nie udało się utworzyć wizyty.',
      response.status,
    );
  }

  return response.json();
}

