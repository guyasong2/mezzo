export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          start_time: string
          end_time: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          id: string
          blocked_date: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          blocked_date: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          blocked_date?: string
          reason?: string | null
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          package_id: string | null
          client_name: string
          client_email: string
          client_phone: string
          location: string | null
          session_date: string
          session_time: string
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id?: string | null
          client_name: string
          client_email: string
          client_phone: string
          location?: string | null
          session_date: string
          session_time: string
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string | null
          client_name?: string
          client_email?: string
          client_phone?: string
          location?: string | null
          session_date?: string
          session_time?: string
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "pricing_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          sort_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          sort_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          sort_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          id: string
          category_id: string | null
          title: string | null
          description: string | null
          alt_text: string
          image_url: string
          storage_path: string
          featured: boolean
          sort_order: number
          width: number | null
          height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title?: string | null
          description?: string | null
          alt_text: string
          image_url: string
          storage_path: string
          featured?: boolean
          sort_order?: number
          width?: number | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string | null
          description?: string | null
          alt_text?: string
          image_url?: string
          storage_path?: string
          featured?: boolean
          sort_order?: number
          width?: number | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      pricing_packages: {
        Row: {
          id: string
          name: string
          slug: string
          price: number
          currency: string
          duration: string | null
          description: string | null
          features: Json
          image_url: string | null
          active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          price: number
          currency?: string
          duration?: string | null
          description?: string | null
          features?: Json
          image_url?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          price?: number
          currency?: string
          duration?: string | null
          description?: string | null
          features?: Json
          image_url?: string | null
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
