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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alba_conversations: {
        Row: {
          category: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      alba_followups: {
        Row: {
          completed_at: string | null
          context: string
          conversation_id: string
          created_at: string
          followup_date: string
          id: string
          response: string | null
          status: string
          topic: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          context: string
          conversation_id: string
          created_at?: string
          followup_date: string
          id?: string
          response?: string | null
          status?: string
          topic: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          context?: string
          conversation_id?: string
          created_at?: string
          followup_date?: string
          id?: string
          response?: string | null
          status?: string
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alba_followups_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "alba_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      alba_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "alba_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "alba_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_expert_answer: boolean | null
          question_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_expert_answer?: boolean | null
          question_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_expert_answer?: boolean | null
          question_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          id: string
          mentor_id: string
          service_name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          id?: string
          mentor_id: string
          service_name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          id?: string
          mentor_id?: string
          service_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_content: {
        Row: {
          active: boolean | null
          category: string
          content_type: string
          content_url: string | null
          created_at: string | null
          description: string
          duration: string
          id: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          category: string
          content_type: string
          content_url?: string | null
          created_at?: string | null
          description: string
          duration: string
          id?: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          category?: string
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          description?: string
          duration?: string
          id?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          avatar_emoji: string | null
          bio: string | null
          category: string
          created_at: string | null
          id: string
          name: string
          price_per_session: number
          rating: number | null
          reviews_count: number | null
          specialty: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          avatar_emoji?: string | null
          bio?: string | null
          category: string
          created_at?: string | null
          id?: string
          name: string
          price_per_session: number
          rating?: number | null
          reviews_count?: number | null
          specialty: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar_emoji?: string | null
          bio?: string | null
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          price_per_session?: number
          rating?: number | null
          reviews_count?: number | null
          specialty?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      moods: {
        Row: {
          created_at: string | null
          id: string
          mood_level: number
          note: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_level: number
          note?: string | null
          source?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_level?: number
          note?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          allergies: string[] | null
          beauty_goals: string[] | null
          birth_date: string | null
          birth_year: number | null
          created_at: string | null
          dietary_preferences: string[] | null
          email: string
          eye_color: string | null
          fitness_level: string | null
          goals: string[] | null
          hair_color: string | null
          hair_type: string | null
          health_goals: string[] | null
          height_cm: number | null
          id: string
          interests: string[] | null
          lifestyle: string | null
          name: string
          onboarding_completed: boolean | null
          preferred_workout_time: string | null
          skin_concerns: string[] | null
          skin_type: string | null
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          allergies?: string[] | null
          beauty_goals?: string[] | null
          birth_date?: string | null
          birth_year?: number | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          email: string
          eye_color?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          hair_color?: string | null
          hair_type?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          interests?: string[] | null
          lifestyle?: string | null
          name: string
          onboarding_completed?: boolean | null
          preferred_workout_time?: string | null
          skin_concerns?: string[] | null
          skin_type?: string | null
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          allergies?: string[] | null
          beauty_goals?: string[] | null
          birth_date?: string | null
          birth_year?: number | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          email?: string
          eye_color?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          hair_color?: string | null
          hair_type?: string | null
          health_goals?: string[] | null
          height_cm?: number | null
          id?: string
          interests?: string[] | null
          lifestyle?: string | null
          name?: string
          onboarding_completed?: boolean | null
          preferred_workout_time?: string | null
          skin_concerns?: string[] | null
          skin_type?: string | null
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          created_at: string | null
          id: string
          question: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          question: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          balance_cents: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_cents?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_cents?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_preferences: {
        Row: {
          auto_topup_amount_cents: number
          auto_topup_enabled: boolean
          auto_topup_threshold_cents: number
          auto_use_wallet: boolean
          created_at: string
          id: string
          preferred_payment_method: string | null
          refund_to_wallet: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_topup_amount_cents?: number
          auto_topup_enabled?: boolean
          auto_topup_threshold_cents?: number
          auto_use_wallet?: boolean
          created_at?: string
          id?: string
          preferred_payment_method?: string | null
          refund_to_wallet?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_topup_amount_cents?: number
          auto_topup_enabled?: boolean
          auto_topup_threshold_cents?: number
          auto_use_wallet?: boolean
          created_at?: string
          id?: string
          preferred_payment_method?: string | null
          refund_to_wallet?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_cents: number
          created_at: string
          description: string
          id: string
          payment_method: string | null
          receipt_url: string | null
          status: string
          stripe_payment_intent_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          description: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          description?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
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
