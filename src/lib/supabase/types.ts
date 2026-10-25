// Shared Database shape aligned with docs/data-model/property-listings-schema.md
// and supabase/migrations/20250321000000_property_listings.sql.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ListingStatus =
  | 'draft'
  | 'published'
  | 'under_offer'
  | 'sold'
  | 'archived'

export type PropertyType =
  | 'multifamily'
  | 'office'
  | 'retail'
  | 'industrial'
  | 'mixed_use'
  | 'land'

export type PropertyListingRow = {
  id: string
  owner_id: string
  title: string
  summary: string | null
  property_type: PropertyType
  address_line1: string
  address_line2: string | null
  city: string
  region: string
  postal_code: string
  country: string
  asking_price: number
  currency: string
  projected_irr_percent: number | null
  cap_rate_percent: number | null
  status: ListingStatus
  closed_at: string | null
  created_at: string
  updated_at: string
}

export type PropertyListingInsert = {
  id?: string
  owner_id: string
  title: string
  summary?: string | null
  property_type: PropertyType
  address_line1: string
  address_line2?: string | null
  city: string
  region: string
  postal_code: string
  country?: string
  asking_price: number
  currency?: string
  projected_irr_percent?: number | null
  cap_rate_percent?: number | null
  status?: ListingStatus
  closed_at?: string | null
  created_at?: string
  updated_at?: string
}

export type PropertyListingUpdate = {
  id?: string
  owner_id?: string
  title?: string
  summary?: string | null
  property_type?: PropertyType
  address_line1?: string
  address_line2?: string | null
  city?: string
  region?: string
  postal_code?: string
  country?: string
  asking_price?: number
  currency?: string
  projected_irr_percent?: number | null
  cap_rate_percent?: number | null
  status?: ListingStatus
  closed_at?: string | null
  created_at?: string
  updated_at?: string
}

export type Database = {
  public: {
    Tables: {
      property_listings: {
        Row: PropertyListingRow
        Insert: PropertyListingInsert
        Update: PropertyListingUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
