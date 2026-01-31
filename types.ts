export interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
  price?: number;
  description?: string;
  settings?: {
    shutter: string;
    aperture: string;
    iso: string;
    lens: string;
  };
}

export enum Category {
  GENERAL = 'Portfolio'
}

export type UserRole = 'ADMIN' | 'EDITOR' | 'GUEST';

export interface AccessKey {
  id: string;
  label: string;
  key: string;
  role: UserRole;
  createdAt: number;
}

export interface UserSession {
  role: UserRole;
  label: string;
}

export interface AboutContent {
  name: string;
  roleLabel: string;
  introHeading: string;
  introDescription1: string;
  introDescription2: string;
  imageUrl: string;
  philosophy: {
    title: string;
    description: string;
  }[];
  equipment: string[];
}

export interface AISuggestion {
  story: string;
  titleSuggestion: string;
  technicalTips: string[];
}