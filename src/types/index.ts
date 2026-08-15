export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PpdbStatus = 'SUBMITTED' | 'VERIFIED' | 'CONTACTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
export type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { articles: number };
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category?: NewsCategory;
  excerpt: string;
  content: string[];
  featuredImage: string;
  author: string;
  status: ContentStatus;
  isFeatured: boolean;
  isPopular: boolean;
  highlightQuote?: string;
  viewsCount: number;
  publishedAt?: string;
  publishedDateText?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpinionAuthor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface OpinionArticle {
  id: string;
  authorId: string;
  author?: OpinionAuthor;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  readTime: string;
  highlightQuote?: string;
  tags: string[];
  status: ContentStatus;
  isFeatured: boolean;
  publishedAt?: string;
  publishedDateText?: string;
  createdAt: string;
}

export interface EducationUnit {
  id: string;
  code: string;
  slug: string;
  name: string;
  shortName?: string;
  badge?: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  profileTitle?: string;
  profileBody: string[];
  curriculumTitle?: string;
  curriculumBody: string[];
  features?: any[];
  facilities?: any[];
  activities?: any[];
  programs?: any[];
}

export interface FeaturedProgram {
  id: string;
  title: string;
  desc: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Agenda {
  id: string;
  title: string;
  description?: string;
  day: string;
  month: string;
  year: string;
  time: string;
  location?: string;
  status?: string;
  isFeatured: boolean;
  isActive: boolean;
  unitId?: string;
  unit?: { name: string; code: string };
}

export interface Achievement {
  id: string;
  title: string;
  winner: string;
  category: string;
  year: string;
  badge: string;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  unitId?: string;
  unit?: { name: string; code: string };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
  isActive: boolean;
  albumId?: string;
  album?: { title: string };
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  category: string;
  content: string;
  avatar: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  category?: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Brochure {
  id: string;
  unitName: string;
  title: string;
  fileSize: string;
  fileUrl: string;
  academicYear?: string;
  sortOrder: number;
}

export interface PpdbApplication {
  id: string;
  registrationNo: string;
  academicYear: string;
  fullName: string;
  nisn: string;
  birthPlaceDate: string;
  previousSchool: string;
  parentName: string;
  whatsapp: string;
  address: string;
  unitCode: string;
  unitId?: string;
  attendanceMode?: string;
  notes?: string;
  status: PpdbStatus;
  submittedAt: string;
  createdAt: string;
  unit?: { name: string; code: string };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  siteName: string;
  siteTagline: string;
  subTagline: string;
  siteDescription: string;
  motto: string;
  leaderName: string;
  leaderRole: string;
  leaderTitle: string;
  leaderPhotoUrl: string;
  leaderQuotes: string[];
  phone: string;
  whatsapp: string;
  email: string;
  addressText: string;
  mapsLink: string;
  consultationUrl: string;
  virtualTourUrl: string;
  logoUrl: string;
}

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: string;
  actor?: { id: string; name: string; email: string };
}

export interface MediaItem {
  id: string;
  filename: string;
  category: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
}
