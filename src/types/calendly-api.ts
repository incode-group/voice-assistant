export interface CalendlyAvailableTime {
  start_time: string;
  end_time: string;
  status: 'available';
  invitees_remaining: number;
  scheduling_url: string;
}

export interface CalendlyAvailableTimesResponse {
  collection: CalendlyAvailableTime[];
}

export interface CalendlySlot {
  id: string;
  label: string;
}

export interface CalendlyBookingParams {
  startTime: string;
  name: string;
  email: string;
}

export interface CalendlyBookingResponse {
  resource: {
    uri: string;
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}
