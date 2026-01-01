export interface TaxRecord {
  createdAt: string;
  name: string;
  country: string;
  gender: string;
  id: string;
  requestDate: string;
  countryId?: string;
  entity: string;
  tax?: number | string;
  normalizedCountry?: string | null;
  bodyCount?: string;
  foo?: string;
  date?: string;
}

export interface Country {
  name: string;
  id: string;
  country?: string;
}

