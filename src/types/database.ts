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
      check_ins: {
        Row: {
          id: string
          user_id: string
          checked_in_at: string
          source: string
          qr_payload: string | null
        }
        Insert: {
          id?: string
          user_id: string
          checked_in_at?: string
          source?: string
          qr_payload?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          checked_in_at?: string
          source?: string
          qr_payload?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          id: string
          message: string
          subject: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          subject: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          subject?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Relationships: []
      }
      idea_submissions: {
        Row: {
          created_at: string
          id: string
          idea_text: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          idea_text: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          idea_text?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Relationships: []
      }
      benefits: {
        Row: {
          bg_color: string
          business: string
          business_description: string | null
          category: string
          created_at: string
          deal: string
          description: string
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          sort_order: number
        }
        Insert: {
          bg_color?: string
          business: string
          business_description?: string | null
          category: string
          created_at?: string
          deal: string
          description: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          sort_order?: number
        }
        Update: {
          bg_color?: string
          business?: string
          business_description?: string | null
          category?: string
          created_at?: string
          deal?: string
          description?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          end_hour: string | null
          event_date: string
          id: string
          image_url: string | null
          is_featured: boolean
          is_paid: boolean
          location: string
          price_amount: number | null
          registration_url: string | null
          start_hour: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          end_hour?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_paid?: boolean
          location: string
          price_amount?: number | null
          registration_url?: string | null
          start_hour: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          end_hour?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_paid?: boolean
          location?: string
          price_amount?: number | null
          registration_url?: string | null
          start_hour?: string
          title?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          birth_date: string | null
          created_at: string
          degree: string | null
          email: string | null
          institution: string | null
          name: string | null
          phone: string | null
          privacy_consent: boolean
          region: string | null
          role: string
          study_year: string | null
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          degree?: string | null
          email?: string | null
          institution?: string | null
          name?: string | null
          phone?: string | null
          privacy_consent?: boolean
          region?: string | null
          role?: string
          study_year?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          degree?: string | null
          email?: string | null
          institution?: string | null
          name?: string | null
          phone?: string | null
          privacy_consent?: boolean
          region?: string | null
          role?: string
          study_year?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opening_hours: {
        Row: {
          close_time: string | null
          day_key: string
          day_label: string
          is_open: boolean
          note: string | null
          open_time: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          close_time?: string | null
          day_key: string
          day_label: string
          is_open?: boolean
          note?: string | null
          open_time?: string | null
          sort_order: number
          updated_at?: string
        }
        Update: {
          close_time?: string | null
          day_key?: string
          day_label?: string
          is_open?: boolean
          note?: string | null
          open_time?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          option_1: string
          option_2: string
          option_3: string | null
          option_4: string | null
          question: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          option_1: string
          option_2: string
          option_3?: string | null
          option_4?: string | null
          question: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          option_1?: string
          option_2?: string
          option_3?: string | null
          option_4?: string | null
          question?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          background_image_url: string | null
          body_text: string | null
          button_text: string | null
          created_at: string
          id: string
          is_active: boolean
          link_url: string | null
          post_type: string
          short_text: string | null
          sort_order: number
          title: string
        }
        Insert: {
          background_image_url?: string | null
          body_text?: string | null
          button_text?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          post_type?: string
          short_text?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          background_image_url?: string | null
          body_text?: string | null
          button_text?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          post_type?: string
          short_text?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      updates: {
        Row: {
          author: string
          button_link_url: string | null
          button_text: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean
          published_at: string
          title: string
        }
        Insert: {
          author?: string
          button_link_url?: string | null
          button_text?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          published_at?: string
          title: string
        }
        Update: {
          author?: string
          button_link_url?: string | null
          button_text?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          published_at?: string
          title?: string
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
    Enums: {},
  },
} as const
