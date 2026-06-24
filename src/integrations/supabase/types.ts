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
      bookings: {
        Row: {
          consent_rodo: boolean
          created_at: string
          email: string | null
          full_name: string
          id: string
          ip_hash: string | null
          message: string | null
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          source: string | null
          status: string
          technology_slug: string | null
          user_agent: string | null
        }
        Insert: {
          consent_rodo?: boolean
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          ip_hash?: string | null
          message?: string | null
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          source?: string | null
          status?: string
          technology_slug?: string | null
          user_agent?: string | null
        }
        Update: {
          consent_rodo?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          ip_hash?: string | null
          message?: string | null
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          source?: string | null
          status?: string
          technology_slug?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      consultation_orders: {
        Row: {
          amount: number
          consultation_type: string
          created_at: string
          currency: string
          email: string
          email_sent_at: string | null
          environment: string
          full_name: string
          id: string
          intake_completed_at: string | null
          intake_data: Json | null
          intake_token: string | null
          notes: string | null
          paid_at: string | null
          phone: string | null
          preferred_date: string | null
          price_id: string
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          consultation_type: string
          created_at?: string
          currency?: string
          email: string
          email_sent_at?: string | null
          environment?: string
          full_name: string
          id?: string
          intake_completed_at?: string | null
          intake_data?: Json | null
          intake_token?: string | null
          notes?: string | null
          paid_at?: string | null
          phone?: string | null
          preferred_date?: string | null
          price_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          consultation_type?: string
          created_at?: string
          currency?: string
          email?: string
          email_sent_at?: string | null
          environment?: string
          full_name?: string
          id?: string
          intake_completed_at?: string | null
          intake_data?: Json | null
          intake_token?: string | null
          notes?: string | null
          paid_at?: string | null
          phone?: string | null
          preferred_date?: string | null
          price_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          active: boolean
          bio: string | null
          buffer_minutes: number
          created_at: string
          default_price_cents: number | null
          display_order: number
          education: string[]
          experience_summary: string | null
          full_name: string
          google_calendar_id: string | null
          id: string
          photo_url: string | null
          portrait_crop: Json | null
          professional_title: string | null
          slot_minutes: number
          slug: string
          specializations: string[]
          title: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string | null
          buffer_minutes?: number
          created_at?: string
          default_price_cents?: number | null
          display_order?: number
          education?: string[]
          experience_summary?: string | null
          full_name: string
          google_calendar_id?: string | null
          id?: string
          photo_url?: string | null
          portrait_crop?: Json | null
          professional_title?: string | null
          slot_minutes?: number
          slug: string
          specializations?: string[]
          title?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string | null
          buffer_minutes?: number
          created_at?: string
          default_price_cents?: number | null
          display_order?: number
          education?: string[]
          experience_summary?: string | null
          full_name?: string
          google_calendar_id?: string | null
          id?: string
          photo_url?: string | null
          portrait_crop?: Json | null
          professional_title?: string | null
          slot_minutes?: number
          slug?: string
          specializations?: string[]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      hidden_pricing_items: {
        Row: {
          created_at: string
          hidden_by: string | null
          id: string
          label: string
          slug: string
        }
        Insert: {
          created_at?: string
          hidden_by?: string | null
          id?: string
          label: string
          slug: string
        }
        Update: {
          created_at?: string
          hidden_by?: string | null
          id?: string
          label?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sitemap_validation_history: {
        Row: {
          base_url: string
          checked_at: string
          created_at: string
          details: Json
          duplicates_count: number
          expected_count: number
          extras_count: number
          fetch_error: string | null
          fetch_ok: boolean
          http_error_count: number
          id: string
          live_count: number
          missing_count: number
          triggered_by: string
        }
        Insert: {
          base_url: string
          checked_at?: string
          created_at?: string
          details?: Json
          duplicates_count?: number
          expected_count?: number
          extras_count?: number
          fetch_error?: string | null
          fetch_ok: boolean
          http_error_count?: number
          id?: string
          live_count?: number
          missing_count?: number
          triggered_by?: string
        }
        Update: {
          base_url?: string
          checked_at?: string
          created_at?: string
          details?: Json
          duplicates_count?: number
          expected_count?: number
          extras_count?: number
          fetch_error?: string | null
          fetch_ok?: boolean
          http_error_count?: number
          id?: string
          live_count?: number
          missing_count?: number
          triggered_by?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      time_off: {
        Row: {
          created_at: string
          doctor_id: string
          ends_at: string
          id: string
          reason: string | null
          starts_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          ends_at: string
          id?: string
          reason?: string | null
          starts_at: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          ends_at?: string
          id?: string
          reason?: string | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_off_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_off_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "public_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_catalog: {
        Row: {
          area: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          name: string
          price_label: string | null
          price_pln: number | null
          slug: string
          sort_order: number
          technology_slug: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          name: string
          price_label?: string | null
          price_pln?: number | null
          slug: string
          sort_order?: number
          technology_slug: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          name?: string
          price_label?: string | null
          price_pln?: number | null
          slug?: string
          sort_order?: number
          technology_slug?: string
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
      visit_bookings: {
        Row: {
          amount_cents: number | null
          calendar_sync_at: string | null
          calendar_sync_attempts: number
          calendar_sync_error: string | null
          calendar_sync_next_at: string | null
          calendar_sync_status: string | null
          cancel_token: string
          created_at: string
          currency: string
          doctor_id: string
          ends_at: string
          google_event_id: string | null
          id: string
          ip_hash: string | null
          notes: string | null
          patient_email: string
          patient_name: string
          patient_phone: string
          payment_status: Database["public"]["Enums"]["visit_payment_status"]
          rodo_consent: boolean
          starts_at: string
          status: Database["public"]["Enums"]["visit_booking_status"]
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          treatment_slug: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          amount_cents?: number | null
          calendar_sync_at?: string | null
          calendar_sync_attempts?: number
          calendar_sync_error?: string | null
          calendar_sync_next_at?: string | null
          calendar_sync_status?: string | null
          cancel_token?: string
          created_at?: string
          currency?: string
          doctor_id: string
          ends_at: string
          google_event_id?: string | null
          id?: string
          ip_hash?: string | null
          notes?: string | null
          patient_email: string
          patient_name: string
          patient_phone: string
          payment_status?: Database["public"]["Enums"]["visit_payment_status"]
          rodo_consent?: boolean
          starts_at: string
          status?: Database["public"]["Enums"]["visit_booking_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          treatment_slug?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          amount_cents?: number | null
          calendar_sync_at?: string | null
          calendar_sync_attempts?: number
          calendar_sync_error?: string | null
          calendar_sync_next_at?: string | null
          calendar_sync_status?: string | null
          cancel_token?: string
          created_at?: string
          currency?: string
          doctor_id?: string
          ends_at?: string
          google_event_id?: string | null
          id?: string
          ip_hash?: string | null
          notes?: string | null
          patient_email?: string
          patient_name?: string
          patient_phone?: string
          payment_status?: Database["public"]["Enums"]["visit_payment_status"]
          rodo_consent?: boolean
          starts_at?: string
          status?: Database["public"]["Enums"]["visit_booking_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          treatment_slug?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visit_bookings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visit_bookings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "public_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      working_hours: {
        Row: {
          created_at: string
          doctor_id: string
          end_time: string
          id: string
          start_time: string
          weekday: number
        }
        Insert: {
          created_at?: string
          doctor_id: string
          end_time: string
          id?: string
          start_time: string
          weekday: number
        }
        Update: {
          created_at?: string
          doctor_id?: string
          end_time?: string
          id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "working_hours_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_hours_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "public_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_doctors: {
        Row: {
          active: boolean | null
          bio: string | null
          display_order: number | null
          education: string[] | null
          experience_summary: string | null
          full_name: string | null
          id: string | null
          photo_url: string | null
          portrait_crop: Json | null
          professional_title: string | null
          slug: string | null
          specializations: string[] | null
          title: string | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          display_order?: number | null
          education?: string[] | null
          experience_summary?: string | null
          full_name?: string | null
          id?: string | null
          photo_url?: string | null
          portrait_crop?: Json | null
          professional_title?: string | null
          slug?: string | null
          specializations?: string[] | null
          title?: string | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          display_order?: number | null
          education?: string[] | null
          experience_summary?: string | null
          full_name?: string | null
          id?: string | null
          photo_url?: string | null
          portrait_crop?: Json | null
          professional_title?: string | null
          slug?: string | null
          specializations?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      visit_booking_status:
        | "pending_payment"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
      visit_payment_status: "unpaid" | "paid" | "refunded" | "failed"
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
      app_role: ["admin", "moderator", "user"],
      visit_booking_status: [
        "pending_payment",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
      visit_payment_status: ["unpaid", "paid", "refunded", "failed"],
    },
  },
} as const
