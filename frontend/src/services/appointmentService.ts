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
    throw new Error('Nie udało się utworzyć wizyty.');
  }

  return response.json();
}

