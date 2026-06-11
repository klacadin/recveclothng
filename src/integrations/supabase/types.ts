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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      checkout_otps: {
        Row: {
          attempts: number
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          user_id: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          change_type: string
          created_at: string
          id: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          product_id: string
          quantity_change: number
        }
        Insert: {
          change_type: string
          created_at?: string
          id?: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          product_id: string
          quantity_change: number
        }
        Update: {
          change_type?: string
          created_at?: string
          id?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          product_id?: string
          quantity_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          size: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity?: number
          size?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          size?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_rate_limits: {
        Row: {
          created_at: string
          customer_email: string | null
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          proof_of_payment_url: string | null
          proof_uploaded_at: string | null
          payment_reference_number: string | null
          shipping_address: string
          waybill_number: string | null
          shipping_fee: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          proof_of_payment_url?: string | null
          proof_uploaded_at?: string | null
          payment_reference_number?: string | null
          shipping_address: string
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
          waybill_number?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          proof_of_payment_url?: string | null
          proof_uploaded_at?: string | null
          payment_reference_number?: string | null
          shipping_address?: string
          waybill_number?: string | null
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          low_stock_threshold: number
          product_id: string
          size: Database["public"]["Enums"]["product_size"]
          sku_suffix: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id: string
          size: Database["public"]["Enums"]["product_size"]
          sku_suffix?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id?: string
          size?: Database["public"]["Enums"]["product_size"]
          sku_suffix?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          created_by_email: string | null
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean
          low_stock_threshold: number
          name: string
          price: number
          sku: string | null
          stock_quantity: number
          weight_grams: number | null
          updated_at: string
          updated_by_email: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by_email?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          low_stock_threshold?: number
          name: string
          price?: number
          sku?: string | null
          stock_quantity?: number
          weight_grams?: number | null
          updated_at?: string
          updated_by_email?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          low_stock_threshold?: number
          name?: string
          price?: number
          sku?: string | null
          stock_quantity?: number
          weight_grams?: number | null
          updated_at?: string
          updated_by_email?: string | null
        }
        Relationships: []
      }
      event_carousel: {
        Row: {
          id: string
          image_url: string
          title: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title?: string
          caption?: string | null
          created_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          source: string
          source_url: string | null
          image_url: string | null
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          source?: string
          source_url?: string | null
          image_url?: string | null
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          source?: string
          source_url?: string | null
          image_url?: string | null
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          read_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          order_id: string | null
          user_id: string | null
          reviewer_name: string
          reviewer_email: string
          rating: number
          comment: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          order_id?: string | null
          user_id?: string | null
          reviewer_name: string
          reviewer_email: string
          rating: number
          comment?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          order_id?: string | null
          user_id?: string | null
          reviewer_name?: string
          reviewer_email?: string
          rating?: number
          comment?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      check_duplicate_order: {
        Args: { _customer_email: string; _minutes?: number; _total: number }
        Returns: boolean
      }
      check_order_rate_limit: {
        Args: {
          _customer_email: string
          _ip_address: string
          _max_orders_per_hour?: number
        }
        Returns: {
          allowed: boolean
          orders_in_last_hour: number
        }[]
      }
      get_products_sold_counts: {
        Args: { product_ids: string[] }
        Returns: { product_id: string; sold_count: number }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reserve_product_stock: {
        Args: { _product_id: string; _quantity: number }
        Returns: {
          available_stock: number
          is_active: boolean
          product_name: string
          product_price: number
          product_sku: string
          success: boolean
        }[]
      }
      reserve_variant_stock: {
        Args: {
          _product_id: string
          _quantity: number
          _size: Database["public"]["Enums"]["product_size"]
        }
        Returns: {
          available_stock: number
          is_active: boolean
          product_name: string
          product_price: number
          product_sku: string
          success: boolean
          variant_sku_suffix: string
        }[]
      }
      restore_product_stock: {
        Args: { _product_id: string; _quantity: number }
        Returns: undefined
      }
      restore_variant_stock: {
        Args: {
          _product_id: string
          _quantity: number
          _size: Database["public"]["Enums"]["product_size"]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
      | "new"
      | "pending_payment"
      | "for_verification"
      | "paid"
      | "preparing"
      | "packed"
      | "for_pickup"
      | "shipped"
      | "completed"
      | "cancelled"
      | "failed"
      payment_method: "cod" | "gcash" | "maya" | "bank_transfer"
      product_size: "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL"
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
      order_status: [
        "new",
        "pending_payment",
        "for_verification",
        "paid",
        "preparing",
        "packed",
        "for_pickup",
        "shipped",
        "completed",
        "cancelled",
        "failed",
      ],
      payment_method: ["cod", "gcash", "maya", "bank_transfer"],
      product_size: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    },
  },
} as const
