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
      appearances: {
        Row: {
          created_at: string
          description_en: string | null
          description_ja: string | null
          event_date: string | null
          id: string
          image_url: string | null
          link_url: string | null
          title_en: string
          title_ja: string
          updated_at: string
          venue_en: string | null
          venue_ja: string | null
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_ja?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          title_en?: string
          title_ja?: string
          updated_at?: string
          venue_en?: string | null
          venue_ja?: string | null
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_ja?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          title_en?: string
          title_ja?: string
          updated_at?: string
          venue_en?: string | null
          venue_ja?: string | null
        }
        Relationships: []
      }
      biography: {
        Row: {
          body_en: string
          body_ja: string
          id: string
          name_en: string
          name_ja: string
          portrait_url: string | null
          updated_at: string
        }
        Insert: {
          body_en?: string
          body_ja?: string
          id?: string
          name_en?: string
          name_ja?: string
          portrait_url?: string | null
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_ja?: string
          id?: string
          name_en?: string
          name_ja?: string
          portrait_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      choreography: {
        Row: {
          client_en: string | null
          client_ja: string | null
          created_at: string
          description_en: string | null
          description_ja: string | null
          id: string
          image_url: string | null
          title_en: string
          title_ja: string
          updated_at: string
          video_url: string | null
          year: number | null
        }
        Insert: {
          client_en?: string | null
          client_ja?: string | null
          created_at?: string
          description_en?: string | null
          description_ja?: string | null
          id?: string
          image_url?: string | null
          title_en?: string
          title_ja?: string
          updated_at?: string
          video_url?: string | null
          year?: number | null
        }
        Update: {
          client_en?: string | null
          client_ja?: string | null
          created_at?: string
          description_en?: string | null
          description_ja?: string | null
          id?: string
          image_url?: string | null
          title_en?: string
          title_ja?: string
          updated_at?: string
          video_url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          email: string | null
          id: string
          instagram: string | null
          management_en: string | null
          management_ja: string | null
          note_en: string | null
          note_ja: string | null
          twitter: string | null
          updated_at: string
          youtube: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          instagram?: string | null
          management_en?: string | null
          management_ja?: string | null
          note_en?: string | null
          note_ja?: string | null
          twitter?: string | null
          updated_at?: string
          youtube?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          instagram?: string | null
          management_en?: string | null
          management_ja?: string | null
          note_en?: string | null
          note_ja?: string | null
          twitter?: string | null
          updated_at?: string
          youtube?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          body_en: string
          body_ja: string
          created_at: string
          id: string
          image_url: string | null
          published_at: string
          title_en: string
          title_ja: string
          updated_at: string
        }
        Insert: {
          body_en?: string
          body_ja?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_at?: string
          title_en?: string
          title_ja?: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_ja?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_at?: string
          title_en?: string
          title_ja?: string
          updated_at?: string
        }
        Relationships: []
      }
      records: {
        Row: {
          cover_url: string | null
          created_at: string
          description_en: string | null
          description_ja: string | null
          format_en: string | null
          format_ja: string | null
          id: string
          link_url: string | null
          release_date: string | null
          title_en: string
          title_ja: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description_en?: string | null
          description_ja?: string | null
          format_en?: string | null
          format_ja?: string | null
          id?: string
          link_url?: string | null
          release_date?: string | null
          title_en?: string
          title_ja?: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description_en?: string | null
          description_ja?: string | null
          format_en?: string | null
          format_ja?: string | null
          id?: string
          link_url?: string | null
          release_date?: string | null
          title_en?: string
          title_ja?: string
          updated_at?: string
        }
        Relationships: []
      }
      slideshow_images: {
        Row: {
          caption_en: string | null
          caption_ja: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption_en?: string | null
          caption_ja?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption_en?: string | null
          caption_ja?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          updated_at?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
