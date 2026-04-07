export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  published?: boolean;
  imageUrl?: string;
  category: string;
  isDigital?: boolean;
  downloadUrl?: string;
  isBestseller?: boolean;
  description?: string;
  features?: string[];
  gallery?: string[];
  specifications?: Record<string, string>;
  relatedProductIds?: string[];
  reviews?: {
    rating: number;
    comment: string;
    author: string;
  }[];
}
