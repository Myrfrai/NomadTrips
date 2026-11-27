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

export interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
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

export interface RegisterPayload extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

export interface TourWritePayload {
  destination?: number | null;
  destination_name?: string;
  destination_description?: string;
  slug: string;
  title: string;
  summary: string;
  region_key: string;
  season_key: string;
  duration_text: string;
  departure_city: string;
  price: number;
  rating: number;
  popular: boolean;
  hero_label: string;
  image_url: string;
  is_published: boolean;
}

export interface AdminOwnedTourSummary {
  id: number;
  title: string;
  slug: string;
}

export interface AdminBookedTourSummary {
  bookingId: number;
  tourId: number;
  tourTitle: string;
  status: BookingStatus;
}

export interface AdminUserOverview {
  id: number;
  email: string;
  username: string;
  role: UserProfile['role'];
  ownedTours: AdminOwnedTourSummary[];
  bookedTours: AdminBookedTourSummary[];
}

export interface AdminTourOverview {
  id: number;
  title: string;
  slug: string;
  summary: string;
  owner: {
    id: number;
    email: string;
    username: string;
  };
  destination: {
    id: number;
    name: string;
    country: string;
  };
  destinationId: number;
  bookingsCount: number;
  price: number;
  regionKey: string;
  seasonKey: string;
  durationText: string;
  departureCity: string;
  rating: number;
  popular: boolean;
  heroLabel: string;
  imageUrl: string;
  isPublished: boolean;
}
