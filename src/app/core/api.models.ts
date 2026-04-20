export type AppLanguage = 'ru' | 'kz' | 'en';

export interface LocalizedText {
  ru: string;
  kz: string;
  en: string;
}

export interface PhotoAttribution {
  author: string;
  sourceLabel: string;
  sourceUrl: string;
  licenseLabel: string;
  licenseUrl: string;
}

export interface Tour {
  id: number;
  slug: string;
  name: LocalizedText;
  summary: LocalizedText;
  region: LocalizedText;
  regionKey: string;
  season: LocalizedText;
  seasonKey: string;
  duration: LocalizedText;
  departure: LocalizedText;
  price: number;
  rating: number;
  popular: boolean;
  heroLabel: string;
  imageUrl: string;
  imageAlt: LocalizedText;
  photoAttribution: PhotoAttribution;
  highlights: LocalizedText[];
  includes: LocalizedText[];
}

export interface TourFilters {
  search: string;
  region: string;
  season: string;
  maxPrice: string;
}

export interface BookingRequest {
  tourId: number;
  fullName: string;
  phone: string;
  travelers: number;
  travelDate: string;
  comment: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: number;
  userId: number;
  tourId: number;
  tourName: LocalizedText;
  travelers: number;
  travelDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  message: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'traveler' | 'manager';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}
