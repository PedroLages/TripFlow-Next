export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          display_name: string
          avatar_url?: string | null
        }
        Update: {
          display_name?: string
          avatar_url?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          id: string
          name: string
          destination: string | null
          start_date: string | null
          end_date: string | null
          currency_code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          destination?: string | null
          start_date?: string | null
          end_date?: string | null
          currency_code?: string
        }
        Update: {
          name?: string
          destination?: string | null
          start_date?: string | null
          end_date?: string | null
          currency_code?: string
        }
        Relationships: []
      }
      trip_members: {
        Row: {
          trip_id: string
          user_id: string
          role: 'owner' | 'organizer' | 'member' | 'guest'
          joined_at: string
        }
        Insert: {
          trip_id: string
          user_id: string
          role?: 'owner' | 'organizer' | 'member' | 'guest'
        }
        Update: {
          role?: 'owner' | 'organizer' | 'member' | 'guest'
        }
        Relationships: [
          {
            foreignKeyName: 'trip_members_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trip_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      blind_budgets: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          amount_cents: number
          currency_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          amount_cents: number
          currency_code?: string
        }
        Update: {
          amount_cents?: number
          currency_code?: string
        }
        Relationships: [
          {
            foreignKeyName: 'blind_budgets_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'blind_budgets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
export type TripMember = Database['public']['Tables']['trip_members']['Row']
export type BlindBudget = Database['public']['Tables']['blind_budgets']['Row']
