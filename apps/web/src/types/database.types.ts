export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
      appointments: {
        Row: {
          cancellation_reason: string | null
          cancelled_by: string | null
          client_id: string
          created_at: string
          deleted_at: string | null
          duration_minutes: number
          end_time: string
          google_event_id: string | null
          id: string
          location_id: string
          notes: string | null
          price_at_booking: number | null
          rescheduled_at: string | null
          rescheduled_from: string | null
          service_id: string
          source: Database['public']['Enums']['appointment_source']
          start_time: string
          status: Database['public']['Enums']['appointment_status']
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_by?: string | null
          client_id: string
          created_at?: string
          deleted_at?: string | null
          duration_minutes: number
          end_time: string
          google_event_id?: string | null
          id?: string
          location_id: string
          notes?: string | null
          price_at_booking?: number | null
          rescheduled_at?: string | null
          rescheduled_from?: string | null
          service_id: string
          source?: Database['public']['Enums']['appointment_source']
          start_time: string
          status?: Database['public']['Enums']['appointment_status']
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_by?: string | null
          client_id?: string
          created_at?: string
          deleted_at?: string | null
          duration_minutes?: number
          end_time?: string
          google_event_id?: string | null
          id?: string
          location_id?: string
          notes?: string | null
          price_at_booking?: number | null
          rescheduled_at?: string | null
          rescheduled_from?: string | null
          service_id?: string
          source?: Database['public']['Enums']['appointment_source']
          start_time?: string
          status?: Database['public']['Enums']['appointment_status']
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_rescheduled_from_fkey'
            columns: ['rescheduled_from']
            isOneToOne: false
            referencedRelation: 'appointments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      client_service_durations: {
        Row: {
          average_duration_minutes: number
          client_id: string
          id: string
          last_appointment_at: string | null
          max_duration_minutes: number
          min_duration_minutes: number
          service_id: string
          total_appointments: number
          updated_at: string
        }
        Insert: {
          average_duration_minutes: number
          client_id: string
          id?: string
          last_appointment_at?: string | null
          max_duration_minutes: number
          min_duration_minutes: number
          service_id: string
          total_appointments?: number
          updated_at?: string
        }
        Update: {
          average_duration_minutes?: number
          client_id?: string
          id?: string
          last_appointment_at?: string | null
          max_duration_minutes?: number
          min_duration_minutes?: number
          service_id?: string
          total_appointments?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'client_service_durations_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'client_service_durations_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
        ]
      }
      clients: {
        Row: {
          birthdate: string | null
          created_at: string
          custom_fields: Json | null
          deleted_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: Database['public']['Enums']['client_source']
          updated_at: string
          user_id: string
        }
        Insert: {
          birthdate?: string | null
          created_at?: string
          custom_fields?: Json | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: Database['public']['Enums']['client_source']
          updated_at?: string
          user_id: string
        }
        Update: {
          birthdate?: string | null
          created_at?: string
          custom_fields?: Json | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: Database['public']['Enums']['client_source']
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clients_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      google_calendar_events: {
        Row: {
          appointment_id: string
          calendar_id: string
          created_at: string
          google_event_id: string
          id: string
          last_error: string | null
          sync_status: Database['public']['Enums']['sync_status']
          synced_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_id: string
          calendar_id: string
          created_at?: string
          google_event_id: string
          id?: string
          last_error?: string | null
          sync_status?: Database['public']['Enums']['sync_status']
          synced_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_id?: string
          calendar_id?: string
          created_at?: string
          google_event_id?: string
          id?: string
          last_error?: string | null
          sync_status?: Database['public']['Enums']['sync_status']
          synced_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'google_calendar_events_appointment_id_fkey'
            columns: ['appointment_id']
            isOneToOne: true
            referencedRelation: 'appointments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'google_calendar_events_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      google_calendar_tokens: {
        Row: {
          access_token: string
          calendar_id: string
          created_at: string
          id: string
          is_active: boolean
          last_sync_at: string | null
          refresh_token: string
          sync_token: string | null
          token_expires_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          calendar_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token: string
          sync_token?: string | null
          token_expires_at: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          calendar_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token?: string
          sync_token?: string | null
          token_expires_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'google_calendar_tokens_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      location_services: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'location_services_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'location_services_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
        ]
      }
      location_travel_times: {
        Row: {
          from_location_id: string
          id: string
          to_location_id: string
          travel_time_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          from_location_id: string
          id?: string
          to_location_id: string
          travel_time_minutes: number
          updated_at?: string
          user_id: string
        }
        Update: {
          from_location_id?: string
          id?: string
          to_location_id?: string
          travel_time_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'location_travel_times_from_location_id_fkey'
            columns: ['from_location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'location_travel_times_to_location_id_fkey'
            columns: ['to_location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'location_travel_times_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          order_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          order_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          order_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'locations_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      personal_blocks: {
        Row: {
          all_day: boolean
          block_type: Database['public']['Enums']['block_type']
          created_at: string
          end_time: string
          id: string
          is_active: boolean
          notes: string | null
          recurrence_end_date: string | null
          recurrence_type: Database['public']['Enums']['recurrence_type']
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_day?: boolean
          block_type?: Database['public']['Enums']['block_type']
          created_at?: string
          end_time: string
          id?: string
          is_active?: boolean
          notes?: string | null
          recurrence_end_date?: string | null
          recurrence_type?: Database['public']['Enums']['recurrence_type']
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_day?: boolean
          block_type?: Database['public']['Enums']['block_type']
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          recurrence_end_date?: string | null
          recurrence_type?: Database['public']['Enums']['recurrence_type']
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'personal_blocks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database['public']['Enums']['account_status']
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: Database['public']['Enums']['user_role']
          settings: Json
          slug: string | null
          timezone: string
          trial_expires_at: string | null
          updated_at: string
        }
        Insert: {
          account_status?: Database['public']['Enums']['account_status']
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          settings?: Json
          slug?: string | null
          timezone?: string
          trial_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: Database['public']['Enums']['account_status']
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          settings?: Json
          slug?: string | null
          timezone?: string
          trial_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          allow_online_booking: boolean
          buffer_time_minutes: number
          color: string | null
          created_at: string
          default_duration_minutes: number
          description: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_online_booking?: boolean
          buffer_time_minutes?: number
          color?: string | null
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_online_booking?: boolean
          buffer_time_minutes?: number
          color?: string | null
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'services_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      system_config: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      travel_blocks: {
        Row: {
          appointment_id: string
          created_at: string
          end_time: string
          from_location_id: string
          id: string
          source: Database['public']['Enums']['travel_source']
          start_time: string
          to_location_id: string
          travel_time_minutes: number
          user_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          end_time: string
          from_location_id: string
          id?: string
          source?: Database['public']['Enums']['travel_source']
          start_time: string
          to_location_id: string
          travel_time_minutes: number
          user_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          end_time?: string
          from_location_id?: string
          id?: string
          source?: Database['public']['Enums']['travel_source']
          start_time?: string
          to_location_id?: string
          travel_time_minutes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'travel_blocks_appointment_id_fkey'
            columns: ['appointment_id']
            isOneToOne: false
            referencedRelation: 'appointments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_blocks_from_location_id_fkey'
            columns: ['from_location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_blocks_to_location_id_fkey'
            columns: ['to_location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'travel_blocks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      working_hours: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          location_id: string
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          location_id: string
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          location_id?: string
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'working_hours_location_id_fkey'
            columns: ['location_id']
            isOneToOne: false
            referencedRelation: 'locations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'working_hours_user_id_fkey'
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
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { '': string }; Returns: string[] }
    }
    Enums: {
      account_status: 'trial' | 'active' | 'readonly' | 'suspended' | 'pending_activation'
      appointment_source: 'manual' | 'online_booking' | 'google_calendar'
      appointment_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
      block_type: 'lunch' | 'vacation' | 'personal' | 'other'
      client_source: 'manual' | 'online_booking' | 'import'
      recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly'
      sync_status: 'pending' | 'synced' | 'error'
      travel_source: 'manual' | 'google_maps'
      user_role: 'professional' | 'superadmin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_status: ['trial', 'active', 'readonly', 'suspended', 'pending_activation'],
      appointment_source: ['manual', 'online_booking', 'google_calendar'],
      appointment_status: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
      block_type: ['lunch', 'vacation', 'personal', 'other'],
      client_source: ['manual', 'online_booking', 'import'],
      recurrence_type: ['none', 'daily', 'weekly', 'monthly'],
      sync_status: ['pending', 'synced', 'error'],
      travel_source: ['manual', 'google_maps'],
      user_role: ['professional', 'superadmin'],
    },
  },
} as const
