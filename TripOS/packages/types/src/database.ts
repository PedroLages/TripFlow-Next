export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          cost_estimate: number | null
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          id: string
          lat: number | null
          lng: number | null
          location: string | null
          name: string
          start_time: string | null
          status: Database["public"]["Enums"]["activity_status"]
          trip_id: string
          updated_at: string
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          name: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          trip_id: string
          updated_at?: string
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          name?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_attendees: {
        Row: {
          activity_id: string
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_attendees_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_drafts: {
        Row: {
          activity_id: string | null
          created_at: string
          created_by: string
          data: Json
          id: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          created_by: string
          data: Json
          id?: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          created_by?: string
          data?: Json
          id?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_drafts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_drafts_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_feed: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at: string
          data: Json | null
          entity_id: string
          entity_type: string
          id: string
          trip_id: string
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at?: string
          data?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          trip_id: string
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          created_at?: string
          data?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_versions: {
        Row: {
          activity_id: string
          changed_at: string
          changed_by: string
          data: Json
          id: string
          version_number: number
        }
        Insert: {
          activity_id: string
          changed_at?: string
          changed_by: string
          data: Json
          id?: string
          version_number: number
        }
        Update: {
          activity_id?: string
          changed_at?: string
          changed_by?: string
          data?: Json
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_versions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_versions_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blind_budgets: {
        Row: {
          budget_amount: number
          created_at: string
          currency: string
          id: string
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_amount: number
          created_at?: string
          currency?: string
          id?: string
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_amount?: number
          created_at?: string
          currency?: string
          id?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blind_budgets_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blind_budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category"]
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          tasks: Json
        }
        Insert: {
          category?: Database["public"]["Enums"]["template_category"]
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          tasks: Json
        }
        Update: {
          category?: Database["public"]["Enums"]["template_category"]
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          tasks?: Json
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_splits: {
        Row: {
          expense_id: string
          id: string
          is_settled: boolean
          settled_at: string | null
          split_amount: number
          user_id: string
        }
        Insert: {
          expense_id: string
          id?: string
          is_settled?: boolean
          settled_at?: string | null
          split_amount: number
          user_id: string
        }
        Update: {
          expense_id?: string
          id?: string
          is_settled?: boolean
          settled_at?: string | null
          split_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_splits_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_splits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          created_by: string
          currency: string
          id: string
          name: string
          notes: string | null
          paid_at: string
          paid_by: string
          receipt_url: string | null
          trip_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by: string
          currency?: string
          id?: string
          name: string
          notes?: string | null
          paid_at?: string
          paid_by: string
          receipt_url?: string | null
          trip_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string
          currency?: string
          id?: string
          name?: string
          notes?: string | null
          paid_at?: string
          paid_by?: string
          receipt_url?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_links: {
        Row: {
          code: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          max_uses: number | null
          role: Database["public"]["Enums"]["trip_role"]
          trip_id: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["trip_role"]
          trip_id: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["trip_role"]
          trip_id?: string
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "invite_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_links_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read_at: string | null
          title: string
          trip_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read_at?: string | null
          title: string
          trip_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          read_at?: string | null
          title?: string
          trip_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          created_at: string
          description: string | null
          id: string
          option_text: string
          poll_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          option_text: string
          poll_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          option_text?: string
          poll_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          closed_at: string | null
          closes_at: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_anonymous: boolean
          max_selections: number | null
          poll_type: Database["public"]["Enums"]["poll_type"]
          title: string
          trip_id: string
        }
        Insert: {
          closed_at?: string | null
          closes_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_anonymous?: boolean
          max_selections?: number | null
          poll_type?: Database["public"]["Enums"]["poll_type"]
          title: string
          trip_id: string
        }
        Update: {
          closed_at?: string | null
          closes_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_anonymous?: boolean
          max_selections?: number | null
          poll_type?: Database["public"]["Enums"]["poll_type"]
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          trip_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          trip_id: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_members: {
        Row: {
          created_at: string
          id: string
          joined_at: string | null
          left_at: string | null
          role: Database["public"]["Enums"]["trip_role"]
          status: Database["public"]["Enums"]["member_status"]
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: Database["public"]["Enums"]["trip_role"]
          status?: Database["public"]["Enums"]["member_status"]
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: Database["public"]["Enums"]["trip_role"]
          status?: Database["public"]["Enums"]["member_status"]
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          archived_at: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          description: string | null
          destination: string | null
          end_date: string | null
          id: string
          is_public: boolean
          name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          rank: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          rank?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          rank?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_trip_with_owner: {
        Args: {
          p_destination: string
          p_end_date: string
          p_start_date: string
          p_trip_name: string
        }
        Returns: string
      }
      ping: { Args: never; Returns: string }
    }
    Enums: {
      action_type:
        | "Added Activity"
        | "Edited Activity"
        | "Deleted Activity"
        | "Voted"
        | "Logged Expense"
        | "Completed Task"
        | "Joined Trip"
        | "Left Trip"
        | "Budget Submitted"
      activity_status:
        | "Draft"
        | "Proposed"
        | "Scheduled"
        | "Completed"
        | "Cancelled"
      attendance_status: "Going" | "Maybe" | "Not Going"
      expense_category:
        | "Accommodation"
        | "Food"
        | "Transport"
        | "Activity"
        | "Other"
      member_status: "Invited" | "Joined" | "Left"
      notification_type:
        | "Invite"
        | "Vote Closed"
        | "Expense Added"
        | "Task Assigned"
        | "Trip Updated"
        | "Member Joined"
        | "Activity Added"
      poll_type: "Single Choice" | "Multiple Choice" | "Ranked Choice"
      task_priority: "Low" | "Medium" | "High"
      task_status: "Todo" | "In Progress" | "Done"
      template_category: "Pre-Trip" | "Packing" | "During Trip" | "Post-Trip"
      trip_role: "Owner" | "Organizer" | "Member" | "Guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      action_type: [
        "Added Activity",
        "Edited Activity",
        "Deleted Activity",
        "Voted",
        "Logged Expense",
        "Completed Task",
        "Joined Trip",
        "Left Trip",
        "Budget Submitted",
      ],
      activity_status: [
        "Draft",
        "Proposed",
        "Scheduled",
        "Completed",
        "Cancelled",
      ],
      attendance_status: ["Going", "Maybe", "Not Going"],
      expense_category: [
        "Accommodation",
        "Food",
        "Transport",
        "Activity",
        "Other",
      ],
      member_status: ["Invited", "Joined", "Left"],
      notification_type: [
        "Invite",
        "Vote Closed",
        "Expense Added",
        "Task Assigned",
        "Trip Updated",
        "Member Joined",
        "Activity Added",
      ],
      poll_type: ["Single Choice", "Multiple Choice", "Ranked Choice"],
      task_priority: ["Low", "Medium", "High"],
      task_status: ["Todo", "In Progress", "Done"],
      template_category: ["Pre-Trip", "Packing", "During Trip", "Post-Trip"],
      trip_role: ["Owner", "Organizer", "Member", "Guest"],
    },
  },
} as const

