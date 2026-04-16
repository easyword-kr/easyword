export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      category: {
        Row: {
          acronym: string
          id: number
          name: string
        }
        Insert: {
          acronym: string
          id?: number
          name: string
        }
        Update: {
          acronym?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      comment: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          jargon_id: string
          parent_id: string | null
          removed: boolean
          translation_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          jargon_id: string
          parent_id?: string | null
          removed?: boolean
          translation_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          jargon_id?: string
          parent_id?: string | null
          removed?: boolean
          translation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_author_id_profile_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_jargon_id_new_fkey"
            columns: ["jargon_id"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_parent_id_new_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_parent_id_new_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comment_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_translation_id_new_fkey"
            columns: ["translation_id"]
            isOneToOne: true
            referencedRelation: "translation"
            referencedColumns: ["id"]
          },
        ]
      }
      example: {
        Row: {
          author_id: string
          created_at: string
          id: string
          source_text: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          source_text: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          source_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "example_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      example_jargon: {
        Row: {
          example_id: string
          jargon_id: string
        }
        Insert: {
          example_id: string
          jargon_id: string
        }
        Update: {
          example_id?: string
          jargon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "example_jargon_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "example"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "example_jargon_jargon_id_fkey"
            columns: ["jargon_id"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
        ]
      }
      example_translation: {
        Row: {
          author_id: string
          created_at: string
          example_id: string
          id: string
          translated_text: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          example_id: string
          id?: string
          translated_text: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          example_id?: string
          id?: string
          translated_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "example_translation_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "example_translation_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "example"
            referencedColumns: ["id"]
          },
        ]
      }
      html: {
        Row: {
          created_at: string
          data: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      jargon: {
        Row: {
          author_id: string
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jargon_author_id_profile_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      jargon_category: {
        Row: {
          category_id: number
          jargon_id: string
        }
        Insert: {
          category_id: number
          jargon_id: string
        }
        Update: {
          category_id?: number
          jargon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jargon_category_category_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jargon_category_jargon_fkey"
            columns: ["jargon_id"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_fb_user: {
        Row: {
          display_name: string
          email: string
          id: string
          last_seen: string | null
          photo_url: string | null
        }
        Insert: {
          display_name: string
          email: string
          id: string
          last_seen?: string | null
          photo_url?: string | null
        }
        Update: {
          display_name?: string
          email?: string
          id?: string
          last_seen?: string | null
          photo_url?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          photo_url: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          photo_url?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      related_jargon: {
        Row: {
          jargon1: string
          jargon2: string
        }
        Insert: {
          jargon1: string
          jargon2: string
        }
        Update: {
          jargon1?: string
          jargon2?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_jargon_jargon1_fkey"
            columns: ["jargon1"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_jargon_jargon2_fkey"
            columns: ["jargon2"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
        ]
      }
      translation: {
        Row: {
          author_id: string
          comment_id: string
          created_at: string
          featured: number | null
          id: string
          jargon_id: string
          llm_rank: number | null
          name: string
          updated_at: string
        }
        Insert: {
          author_id: string
          comment_id: string
          created_at?: string
          featured?: number | null
          id?: string
          jargon_id: string
          llm_rank?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          comment_id?: string
          created_at?: string
          featured?: number | null
          id?: string
          jargon_id?: string
          llm_rank?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "translation_author_id_profile_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translation_jargon_id_new_fkey"
            columns: ["jargon_id"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      comment_safe: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string | null
          jargon_id: string | null
          parent_id: string | null
          removed: boolean | null
          translation_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: never
          created_at?: string | null
          id?: string | null
          jargon_id?: string | null
          parent_id?: string | null
          removed?: boolean | null
          translation_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: never
          created_at?: string | null
          id?: string | null
          jargon_id?: string | null
          parent_id?: string | null
          removed?: boolean | null
          translation_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_author_id_profile_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_jargon_id_new_fkey"
            columns: ["jargon_id"]
            isOneToOne: false
            referencedRelation: "jargon"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_parent_id_new_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_parent_id_new_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comment_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_translation_id_new_fkey"
            columns: ["translation_id"]
            isOneToOne: true
            referencedRelation: "translation"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_example_translation: {
        Args: { p_example_id: string; p_translated_text: string }
        Returns: string
      }
      admin_remove_featured: {
        Args: { p_translation_id: string }
        Returns: boolean
      }
      admin_update_featured_order: {
        Args: { p_featured_rank: number; p_translation_id: string }
        Returns: boolean
      }
      count_search_jargons: { Args: { search_query?: string }; Returns: number }
      create_comment: {
        Args: { p_content: string; p_jargon_id: string; p_parent_id?: string }
        Returns: string
      }
      create_comment_as_admin: {
        Args: {
          p_author_id: string
          p_content: string
          p_jargon_id: string
          p_parent_id?: string
        }
        Returns: string
      }
      create_example: {
        Args: {
          p_jargon_ids?: string[]
          p_source_text: string
          p_translation: string
        }
        Returns: string
      }
      delete_claim: { Args: { claim: string; uid: string }; Returns: string }
      delete_example: { Args: { p_example_id: string }; Returns: boolean }
      delete_example_translation: {
        Args: { p_example_translation_id: string }
        Returns: boolean
      }
      generate_slug: { Args: { input_text: string }; Returns: string }
      get_claim: { Args: { claim: string; uid: string }; Returns: Json }
      get_claims: { Args: { uid: string }; Returns: Json }
      get_example: {
        Args: { example_id: string }
        Returns: {
          author: Json
          created_at: string
          id: string
          jargons: Json
          source_text: string
          translations: Json
          updated_at: string
        }[]
      }
      get_my_claim: { Args: { claim: string }; Returns: Json }
      get_my_claims: { Args: never; Returns: Json }
      is_claims_admin: { Args: never; Returns: boolean }
      list_examples: {
        Args: {
          jargon_query?: string
          limit_count?: number
          offset_count?: number
          p_jargon_id?: string
          search_query?: string
        }
        Returns: {
          author: Json
          created_at: string
          id: string
          jargons: Json
          source_text: string
          translations: Json
          updated_at: string
        }[]
      }
      list_featured_jargons: {
        Args: { limit_count?: number }
        Returns: {
          categories: Json
          comments: Json
          id: string
          name: string
          slug: string
          translation: string
          updated_at: string
        }[]
      }
      list_jargon_random: {
        Args: { seed?: unknown }
        Returns: {
          author_id: string
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "jargon"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      remove_comment: { Args: { p_comment_id: string }; Returns: boolean }
      remove_jargon: { Args: { p_jargon_id: string }; Returns: boolean }
      remove_translation: {
        Args: { p_translation_id: string }
        Returns: boolean
      }
      search_jargons: {
        Args: {
          category_acronyms?: string[]
          limit_count?: number
          offset_count?: number
          search_query?: string
          sort_option?: string
        }
        Returns: {
          categories: Json
          comments: Json
          id: string
          name: string
          slug: string
          translations: Json
          updated_at: string
        }[]
      }
      set_claim: {
        Args: { claim: string; uid: string; value: Json }
        Returns: string
      }
      suggest_jargon: {
        Args: {
          p_category_ids: number[]
          p_comment: string
          p_name: string
          p_translation: string
        }
        Returns: {
          comment_id: string
          jargon_id: string
          jargon_slug: string
          translation_id: string
        }[]
      }
      suggest_jargon_as_admin: {
        Args: {
          p_author_id: string
          p_category_ids: number[]
          p_comment: string
          p_name: string
          p_translation: string
        }
        Returns: {
          comment_id: string
          jargon_id: string
          jargon_slug: string
          translation_id: string
        }[]
      }
      suggest_translation: {
        Args: { p_comment: string; p_jargon_id: string; p_translation: string }
        Returns: {
          comment_id: string
          translation_id: string
        }[]
      }
      suggest_translation_as_admin: {
        Args: {
          p_author_id: string
          p_comment: string
          p_jargon_id: string
          p_translation: string
        }
        Returns: {
          comment_id: string
          translation_id: string
        }[]
      }
      to_lowercase: {
        Args: { jargon: Database["public"]["Tables"]["jargon"]["Row"] }
        Returns: string
      }
      to_lowercase_no_spaces: {
        Args: { jargon: Database["public"]["Tables"]["jargon"]["Row"] }
        Returns: string
      }
      to_lowercase_no_spaces_translation: {
        Args: {
          translation: Database["public"]["Tables"]["translation"]["Row"]
        }
        Returns: string
      }
      update_comment: {
        Args: { p_comment_id: string; p_content: string }
        Returns: boolean
      }
      update_example: {
        Args: { p_example_id: string; p_source_text: string }
        Returns: boolean
      }
      update_example_translation: {
        Args: { p_example_translation_id: string; p_translated_text: string }
        Returns: boolean
      }
      update_jargon: {
        Args: { p_jargon_id: string; p_name: string }
        Returns: {
          jargon_id: string
          jargon_slug: string
        }[]
      }
      update_jargon_categories: {
        Args: { p_category_ids: number[]; p_jargon_id: string }
        Returns: boolean
      }
      update_translation: {
        Args: { p_name: string; p_translation_id: string }
        Returns: boolean
      }
      upsert_example_jargon: {
        Args: { p_example_id: string; p_jargon_id: string }
        Returns: boolean
      }
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

