import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  pgEnum,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "pending_payment",
  "for_verification",
  "paid",
  "preparing",
  "packed",
  "shipped",
  "for_pickup",
  "completed",
  "cancelled",
  "failed",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cod",
  "gcash",
  "maya",
  "bank_transfer",
]);

export const productSizeEnum = pgEnum("product_size", [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "XXL",
  "XXXL",
]);

export const affiliateStatusEnum = pgEnum("affiliate_status", [
  "active",
  "inactive",
  "pending",
]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
  sku: text("sku"),
  category: text("category"),
  imageUrl: text("image_url"),
  images: text("images").array(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  weightGrams: integer("weight_grams"),
  isActive: boolean("is_active").notNull().default(true),
  createdByEmail: text("created_by_email"),
  updatedByEmail: text("updated_by_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: productSizeEnum("size").notNull(),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    skuSuffix: text("sku_suffix"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("product_variants_product_size_idx").on(t.productId, t.size)]
);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  code: text("code"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const affiliates = pgTable(
  "affiliates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id"),
    code: text("code").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    status: affiliateStatusEnum("status").notNull().default("active"),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 4 })
      .notNull()
      .default("0.1000"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("affiliates_code_idx").on(t.code),
    uniqueIndex("affiliates_email_idx").on(t.email),
    index("affiliates_clerk_user_id_idx").on(t.clerkUserId),
  ]
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone"),
    shippingAddress: text("shipping_address").notNull(),
    status: orderStatusEnum("status").notNull().default("new"),
    paymentMethod: paymentMethodEnum("payment_method").notNull().default("gcash"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
    shippingFee: numeric("shipping_fee", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    notes: text("notes"),
    proofOfPaymentUrl: text("proof_of_payment_url"),
    proofUploadedAt: timestamp("proof_uploaded_at", { withTimezone: true }),
    paymentReferenceNumber: text("payment_reference_number"),
    hitpayPaymentId: text("hitpay_payment_id"),
    waybillNumber: text("waybill_number"),
    userId: text("user_id"),
    affiliateId: uuid("affiliate_id").references(() => affiliates.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("orders_affiliate_id_idx").on(t.affiliateId), index("orders_status_idx").on(t.status)]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id),
    productName: text("product_name").notNull(),
    productSku: text("product_sku"),
    quantity: integer("quantity").notNull().default(1),
    size: text("size"),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("order_items_order_id_idx").on(t.orderId)]
);

/** Commission rows are created only when an order becomes paid/confirmed. */
export const affiliateCommissions = pgTable(
  "affiliate_commissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    affiliateId: uuid("affiliate_id")
      .notNull()
      .references(() => affiliates.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    orderNumber: text("order_number").notNull(),
    orderSubtotal: numeric("order_subtotal", { precision: 12, scale: 2 }).notNull(),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 4 }).notNull(),
    commissionAmount: numeric("commission_amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("affiliate_commissions_order_idx").on(t.orderId),
    index("affiliate_commissions_affiliate_id_idx").on(t.affiliateId),
  ]
);

export const userApprovals = pgTable(
  "user_approvals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text("email").notNull(),
    status: text("status").notNull().default("pending"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("user_approvals_clerk_user_id_idx").on(t.clerkUserId)]
);

export const vouchers = pgTable("vouchers", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull().default("percent"),
  discountValue: numeric("discount_value", { precision: 12, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }).default("0"),
  description: text("description"),
  productIds: jsonb("product_ids").$type<string[]>().default([]),
  categoryIds: jsonb("category_ids").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  source: text("source").notNull().default("manual"),
  sourceUrl: text("source_url"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const eventCarousel = pgTable("event_carousel", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderRateLimits = pgTable("order_rate_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  ipAddress: text("ip_address").notNull(),
  customerEmail: text("customer_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const affiliatesRelations = relations(affiliates, ({ many }) => ({
  orders: many(orders),
  commissions: many(affiliateCommissions),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  affiliate: one(affiliates, {
    fields: [orders.affiliateId],
    references: [affiliates.id],
  }),
  items: many(orderItems),
  commission: one(affiliateCommissions, {
    fields: [orders.id],
    references: [affiliateCommissions.orderId],
  }),
}));

/** Statuses that count as confirmed/paid sales for affiliates */
export const PAID_ORDER_STATUSES = [
  "paid",
  "preparing",
  "packed",
  "shipped",
  "for_pickup",
  "completed",
] as const;

export const DEFAULT_AFFILIATE_COMMISSION_RATE = 0.1;
export const AFFILIATE_COOKIE_NAME = "reve_aff";
export const AFFILIATE_COOKIE_DAYS = 30;

/** Key/value store settings (e.g. default affiliate commission rate). */
export const storeSettings = pgTable("store_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
