export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_table: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      children: {
        Row: {
          child_code: string
          created_at: string
          created_by: string | null
          current_grade: string | null
          date_of_birth: string | null
          education_status: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          guardian_info: string | null
          health_notes: string | null
          id: string
          intake_date: string
          is_sensitive: boolean
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          child_code?: string
          created_at?: string
          created_by?: string | null
          current_grade?: string | null
          date_of_birth?: string | null
          education_status?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          guardian_info?: string | null
          health_notes?: string | null
          id?: string
          intake_date?: string
          is_sensitive?: boolean
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          child_code?: string
          created_at?: string
          created_by?: string | null
          current_grade?: string | null
          date_of_birth?: string | null
          education_status?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          guardian_info?: string | null
          health_notes?: string | null
          id?: string
          intake_date?: string
          is_sensitive?: boolean
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      compliance_records: {
        Row: {
          category: string
          completed_date: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          responsible_user: string | null
          status: Database["public"]["Enums"]["compliance_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          responsible_user?: string | null
          status?: Database["public"]["Enums"]["compliance_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          responsible_user?: string | null
          status?: Database["public"]["Enums"]["compliance_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          bucket: string
          category: string | null
          created_at: string
          description: string | null
          doc_kind: string | null
          file_name: string
          file_type: string | null
          id: string
          owner_id: string
          owner_table: string
          storage_path: string
          tags: string[] | null
          title: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket: string
          category?: string | null
          created_at?: string
          description?: string | null
          doc_kind?: string | null
          file_name: string
          file_type?: string | null
          id?: string
          owner_id: string
          owner_table: string
          storage_path: string
          tags?: string[] | null
          title?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket?: string
          category?: string | null
          created_at?: string
          description?: string | null
          doc_kind?: string | null
          file_name?: string
          file_type?: string | null
          id?: string
          owner_id?: string
          owner_table?: string
          storage_path?: string
          tags?: string[] | null
          title?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["sponsorship_category"] | null
          created_at: string
          created_by: string | null
          currency: string
          donation_date: string
          frequency: Database["public"]["Enums"]["donation_frequency"]
          id: string
          notes: string | null
          sponsor_id: string | null
          target_child_id: string | null
          target_event_id: string | null
          target_inventory_id: string | null
          target_type: Database["public"]["Enums"]["sponsorship_target"]
        }
        Insert: {
          amount?: number
          category?: Database["public"]["Enums"]["sponsorship_category"] | null
          created_at?: string
          created_by?: string | null
          currency?: string
          donation_date?: string
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          id?: string
          notes?: string | null
          sponsor_id?: string | null
          target_child_id?: string | null
          target_event_id?: string | null
          target_inventory_id?: string | null
          target_type?: Database["public"]["Enums"]["sponsorship_target"]
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["sponsorship_category"] | null
          created_at?: string
          created_by?: string | null
          currency?: string
          donation_date?: string
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          id?: string
          notes?: string | null
          sponsor_id?: string | null
          target_child_id?: string | null
          target_event_id?: string | null
          target_inventory_id?: string | null
          target_type?: Database["public"]["Enums"]["sponsorship_target"]
        }
        Relationships: [
          {
            foreignKeyName: "donations_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_target_child_id_fkey"
            columns: ["target_child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_target_inventory_id_fkey"
            columns: ["target_inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          attended: boolean | null
          child_id: string | null
          created_at: string
          event_id: string
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          attended?: boolean | null
          child_id?: string | null
          created_at?: string
          event_id: string
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          attended?: boolean | null
          child_id?: string | null
          created_at?: string
          event_id?: string
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          id: string
          location: string | null
          start_at: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          location?: string | null
          start_at: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          location?: string | null
          start_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: Database["public"]["Enums"]["inventory_category"]
          created_at: string
          created_by: string | null
          expiry_date: string | null
          id: string
          inv_code: string
          location: string | null
          low_stock_threshold: number
          name: string
          notes: string | null
          quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["inventory_category"]
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          inv_code?: string
          location?: string | null
          low_stock_threshold?: number
          name: string
          notes?: string | null
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["inventory_category"]
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          inv_code?: string
          location?: string | null
          low_stock_threshold?: number
          name?: string
          notes?: string | null
          quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          created_at: string
          id: string
          item_id: string
          movement: Database["public"]["Enums"]["inventory_movement"]
          performed_by: string | null
          quantity: number
          reason: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          movement: Database["public"]["Enums"]["inventory_movement"]
          performed_by?: string | null
          quantity: number
          reason?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          movement?: Database["public"]["Enums"]["inventory_movement"]
          performed_by?: string | null
          quantity?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          type: Database["public"]["Enums"]["sponsor_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          type?: Database["public"]["Enums"]["sponsor_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          type?: Database["public"]["Enums"]["sponsor_type"]
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          background_check_date: string | null
          background_check_done: boolean
          certifications: string | null
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          is_volunteer: boolean
          notes: string | null
          phone: string | null
          position: string | null
          shift_schedule: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          background_check_date?: string | null
          background_check_done?: boolean
          certifications?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          is_volunteer?: boolean
          notes?: string | null
          phone?: string | null
          position?: string | null
          shift_schedule?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          background_check_date?: string | null
          background_check_done?: boolean
          certifications?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          is_volunteer?: boolean
          notes?: string | null
          phone?: string | null
          position?: string | null
          shift_schedule?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read: { Args: { _user_id: string }; Returns: boolean }
      get_landing_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff_or_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff" | "volunteer" | "auditor"
      compliance_status: "pending" | "compliant" | "overdue" | "expired"
      donation_frequency: "one_time" | "monthly" | "quarterly" | "yearly"
      event_status:
        | "upcoming"
        | "ongoing"
        | "completed"
        | "cancelled"
        | "postponed"
      gender_type: "male" | "female" | "other"
      inventory_category: "food" | "clothing" | "medical" | "asset" | "other"
      inventory_movement: "in" | "out" | "adjust" | "expired"
      sponsor_type: "individual" | "foundation" | "corporate"
      sponsorship_category:
        | "education"
        | "feeding"
        | "health"
        | "clothing"
        | "other"
      sponsorship_target: "child" | "event" | "inventory" | "general"
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
  public: {
    Enums: {
      app_role: ["admin", "staff", "volunteer", "auditor"],
      compliance_status: ["pending", "compliant", "overdue", "expired"],
      donation_frequency: ["one_time", "monthly", "quarterly", "yearly"],
      event_status: [
        "upcoming",
        "ongoing",
        "completed",
        "cancelled",
        "postponed",
      ],
      gender_type: ["male", "female", "other"],
      inventory_category: ["food", "clothing", "medical", "asset", "other"],
      inventory_movement: ["in", "out", "adjust", "expired"],
      sponsor_type: ["individual", "foundation", "corporate"],
      sponsorship_category: [
        "education",
        "feeding",
        "health",
        "clothing",
        "other",
      ],
      sponsorship_target: ["child", "event", "inventory", "general"],
    },
  },
} as const
