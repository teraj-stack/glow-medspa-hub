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
      audit_log: {
        Row: {
          action: string | null
          actor_ip: unknown
          actor_ua: string | null
          actor_user_id: string | null
          event_type: string
          id: number
          metadata: Json
          occurred_at: string
          resource_id: string | null
          resource_type: string | null
          severity: Database["public"]["Enums"]["audit_severity"]
          success: boolean
        }
        Insert: {
          action?: string | null
          actor_ip?: unknown
          actor_ua?: string | null
          actor_user_id?: string | null
          event_type: string
          id?: number
          metadata?: Json
          occurred_at?: string
          resource_id?: string | null
          resource_type?: string | null
          severity?: Database["public"]["Enums"]["audit_severity"]
          success?: boolean
        }
        Update: {
          action?: string | null
          actor_ip?: unknown
          actor_ua?: string | null
          actor_user_id?: string | null
          event_type?: string
          id?: number
          metadata?: Json
          occurred_at?: string
          resource_id?: string | null
          resource_type?: string | null
          severity?: Database["public"]["Enums"]["audit_severity"]
          success?: boolean
        }
        Relationships: []
      }
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
      consultation_ai_access_state: {
        Row: {
          id: string
          message: string
          status: number
          updated_at: string
        }
        Insert: {
          id: string
          message: string
          status: number
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          status?: number
          updated_at?: string
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
      creator_drafts: {
        Row: {
          created_at: string
          data: Json
          draft_key: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          draft_key: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          draft_key?: string
          id?: string
          updated_at?: string
          user_id?: string
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
      nap_settings: {
        Row: {
          business_name: string
          categories: string[]
          city: string
          country_code: string
          description: string | null
          email: string | null
          google_business_profile_url: string | null
          google_maps_url: string | null
          hours_json: Json
          id: boolean
          latitude: number | null
          legal_name: string | null
          longitude: number | null
          phone: string | null
          phone_e164: string | null
          postal_code: string
          region: string
          street_address: string
          updated_at: string
          updated_by: string | null
          website: string
        }
        Insert: {
          business_name?: string
          categories?: string[]
          city?: string
          country_code?: string
          description?: string | null
          email?: string | null
          google_business_profile_url?: string | null
          google_maps_url?: string | null
          hours_json?: Json
          id?: boolean
          latitude?: number | null
          legal_name?: string | null
          longitude?: number | null
          phone?: string | null
          phone_e164?: string | null
          postal_code?: string
          region?: string
          street_address?: string
          updated_at?: string
          updated_by?: string | null
          website?: string
        }
        Update: {
          business_name?: string
          categories?: string[]
          city?: string
          country_code?: string
          description?: string | null
          email?: string | null
          google_business_profile_url?: string | null
          google_maps_url?: string | null
          hours_json?: Json
          id?: boolean
          latitude?: number | null
          legal_name?: string | null
          longitude?: number | null
          phone?: string | null
          phone_e164?: string | null
          postal_code?: string
          region?: string
          street_address?: string
          updated_at?: string
          updated_by?: string | null
          website?: string
        }
        Relationships: []
      }
      og_rescrape_results: {
        Row: {
          facebook_attempts: number
          facebook_error: string | null
          facebook_ok: boolean
          facebook_skipped: boolean
          facebook_status: number | null
          id: number
          linkedin_attempts: number
          linkedin_error: string | null
          linkedin_ok: boolean
          linkedin_status: number | null
          processed_at: string | null
          run_id: string
          status: string
          url: string
        }
        Insert: {
          facebook_attempts?: number
          facebook_error?: string | null
          facebook_ok?: boolean
          facebook_skipped?: boolean
          facebook_status?: number | null
          id?: number
          linkedin_attempts?: number
          linkedin_error?: string | null
          linkedin_ok?: boolean
          linkedin_status?: number | null
          processed_at?: string | null
          run_id: string
          status?: string
          url: string
        }
        Update: {
          facebook_attempts?: number
          facebook_error?: string | null
          facebook_ok?: boolean
          facebook_skipped?: boolean
          facebook_status?: number | null
          id?: number
          linkedin_attempts?: number
          linkedin_error?: string | null
          linkedin_ok?: boolean
          linkedin_status?: number | null
          processed_at?: string | null
          run_id?: string
          status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "og_rescrape_results_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "og_rescrape_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      og_rescrape_runs: {
        Row: {
          base_url: string
          commit_sha: string | null
          duration_ms: number
          error: string | null
          facebook_ok: number
          facebook_skipped: boolean
          finished_at: string
          id: string
          last_progress_at: string | null
          linkedin_ok: number
          processed: number
          started_at: string
          status: string
          total: number
          triggered_by: string
        }
        Insert: {
          base_url: string
          commit_sha?: string | null
          duration_ms?: number
          error?: string | null
          facebook_ok?: number
          facebook_skipped?: boolean
          finished_at?: string
          id?: string
          last_progress_at?: string | null
          linkedin_ok?: number
          processed?: number
          started_at?: string
          status?: string
          total?: number
          triggered_by?: string
        }
        Update: {
          base_url?: string
          commit_sha?: string | null
          duration_ms?: number
          error?: string | null
          facebook_ok?: number
          facebook_skipped?: boolean
          finished_at?: string
          id?: string
          last_progress_at?: string | null
          linkedin_ok?: number
          processed?: number
          started_at?: string
          status?: string
          total?: number
          triggered_by?: string
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
      seo_bulk_inspection_reports: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          results: Json
          summary: Json
          triggered_by: string
          url_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          results?: Json
          summary?: Json
          triggered_by: string
          url_count: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          results?: Json
          summary?: Json
          triggered_by?: string
          url_count?: number
        }
        Relationships: []
      }
      seo_indexation_submissions: {
        Row: {
          created_at: string
          http_status: number | null
          id: string
          kind: string
          provider: string
          response: string | null
          status: string
          target: string
          triggered_by: string
        }
        Insert: {
          created_at?: string
          http_status?: number | null
          id?: string
          kind: string
          provider: string
          response?: string | null
          status: string
          target: string
          triggered_by?: string
        }
        Update: {
          created_at?: string
          http_status?: number | null
          id?: string
          kind?: string
          provider?: string
          response?: string | null
          status?: string
          target?: string
          triggered_by?: string
        }
        Relationships: []
      }
      seo_keyword_research_reports: {
        Row: {
          append_location: string | null
          clusters: Json | null
          clusters_generated_at: string | null
          created_at: string
          created_by: string | null
          database: string
          id: string
          label: string | null
          phrase_count: number
          rows: Json
          triggered_by: string
        }
        Insert: {
          append_location?: string | null
          clusters?: Json | null
          clusters_generated_at?: string | null
          created_at?: string
          created_by?: string | null
          database: string
          id?: string
          label?: string | null
          phrase_count: number
          rows?: Json
          triggered_by: string
        }
        Update: {
          append_location?: string | null
          clusters?: Json | null
          clusters_generated_at?: string | null
          created_at?: string
          created_by?: string | null
          database?: string
          id?: string
          label?: string | null
          phrase_count?: number
          rows?: Json
          triggered_by?: string
        }
        Relationships: []
      }
      seo_report_settings: {
        Row: {
          channel: string
          enabled: boolean
          fallback_to_admins: boolean
          id: boolean
          notification_emails: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          channel?: string
          enabled?: boolean
          fallback_to_admins?: boolean
          id?: boolean
          notification_emails?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          channel?: string
          enabled?: boolean
          fallback_to_admins?: boolean
          id?: boolean
          notification_emails?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      seo_snapshot_competitors: {
        Row: {
          common_keywords: number | null
          competition_level: number | null
          competitor_domain: string
          competitor_keywords: number | null
          competitor_traffic: number | null
          id: number
          rank_position: number | null
          snapshot_id: string
        }
        Insert: {
          common_keywords?: number | null
          competition_level?: number | null
          competitor_domain: string
          competitor_keywords?: number | null
          competitor_traffic?: number | null
          id?: number
          rank_position?: number | null
          snapshot_id: string
        }
        Update: {
          common_keywords?: number | null
          competition_level?: number | null
          competitor_domain?: string
          competitor_keywords?: number | null
          competitor_traffic?: number | null
          id?: number
          rank_position?: number | null
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_snapshot_competitors_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "seo_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_snapshot_gap_keywords: {
        Row: {
          competitor_domain: string | null
          competitor_position: number | null
          cpc: number | null
          id: number
          phrase: string
          position_index: number | null
          search_volume: number | null
          snapshot_id: string
        }
        Insert: {
          competitor_domain?: string | null
          competitor_position?: number | null
          cpc?: number | null
          id?: number
          phrase: string
          position_index?: number | null
          search_volume?: number | null
          snapshot_id: string
        }
        Update: {
          competitor_domain?: string | null
          competitor_position?: number | null
          cpc?: number | null
          id?: number
          phrase?: string
          position_index?: number | null
          search_volume?: number | null
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_snapshot_gap_keywords_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "seo_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_snapshot_keywords: {
        Row: {
          cpc: number | null
          id: number
          phrase: string
          position: number | null
          position_index: number | null
          previous_position: number | null
          search_volume: number | null
          snapshot_id: string
          traffic_percent: number | null
          url: string | null
        }
        Insert: {
          cpc?: number | null
          id?: number
          phrase: string
          position?: number | null
          position_index?: number | null
          previous_position?: number | null
          search_volume?: number | null
          snapshot_id: string
          traffic_percent?: number | null
          url?: string | null
        }
        Update: {
          cpc?: number | null
          id?: number
          phrase?: string
          position?: number | null
          position_index?: number | null
          previous_position?: number | null
          search_volume?: number | null
          snapshot_id?: string
          traffic_percent?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_snapshot_keywords_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "seo_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_snapshots: {
        Row: {
          captured_at: string
          competitors_count: number | null
          created_at: string
          database: string
          domain: string
          error: string | null
          gap_keywords_count: number | null
          id: string
          organic_cost: number | null
          organic_keywords: number | null
          organic_traffic: number | null
          raw_debug: Json | null
          triggered_by: string
        }
        Insert: {
          captured_at?: string
          competitors_count?: number | null
          created_at?: string
          database: string
          domain: string
          error?: string | null
          gap_keywords_count?: number | null
          id?: string
          organic_cost?: number | null
          organic_keywords?: number | null
          organic_traffic?: number | null
          raw_debug?: Json | null
          triggered_by?: string
        }
        Update: {
          captured_at?: string
          competitors_count?: number | null
          created_at?: string
          database?: string
          domain?: string
          error?: string | null
          gap_keywords_count?: number | null
          id?: string
          organic_cost?: number | null
          organic_keywords?: number | null
          organic_traffic?: number | null
          raw_debug?: Json | null
          triggered_by?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      public_time_off: {
        Row: {
          doctor_id: string | null
          ends_at: string | null
          starts_at: string | null
        }
        Insert: {
          doctor_id?: string | null
          ends_at?: string | null
          starts_at?: string | null
        }
        Update: {
          doctor_id?: string | null
          ends_at?: string | null
          starts_at?: string | null
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
      suspicious_activity: {
        Row: {
          actor_ip: unknown
          actor_user_id: string | null
          event_type: string | null
          failures: number | null
          hits: number | null
          minute: string | null
          reason: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      log_audit_event: {
        Args: {
          _action: string
          _actor_ip?: string
          _actor_ua?: string
          _event_type: string
          _metadata?: Json
          _resource_id?: string
          _resource_type?: string
          _severity?: Database["public"]["Enums"]["audit_severity"]
          _success?: boolean
        }
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
      purge_old_audit_log: { Args: never; Returns: undefined }
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
      audit_severity: "info" | "warning" | "critical"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      audit_severity: ["info", "warning", "critical"],
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
