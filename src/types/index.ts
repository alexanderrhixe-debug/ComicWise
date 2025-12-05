export interface Comic {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  status: "Ongoing" | "Hiatus" | "Completed" | "Dropped" | "Coming Soon";
  publicationDate: Date;
  rating: string | null;
  views: number;
  authorId?: number | null;
  artistId?: number | null;
  typeId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: number;
  title: string;
  chapterNumber: number;
  releaseDate: Date;
  comicId: number;
  views: number;
  createdAt: Date;
}

export interface Author {
  id: number;
  name: string;
  bio?: string | null;
  image?: string | null;
  createdAt: Date;
}

export interface Artist {
  id: number;
  name: string;
  bio?: string | null;
  image?: string | null;
  createdAt: Date;
}

export interface Genre {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export interface Type {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export interface Bookmark {
  userId: string;
  comicId: number;
  lastReadChapterId?: number | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  content: string;
  userId: string;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComicWithDetails extends Comic {
  author?: Author | null;
  artist?: Artist | null;
  type?: Type | null;
  genres?: Genre[];
  chapters?: Chapter[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ComicFilters extends PaginationParams {
  search?: string;
  typeId?: number;
  genreIds?: number[];
  status?: Comic["status"];
  minRating?: number;
  sortBy?: "latest" | "rating" | "title" | "views";
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ActionResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
}
