-- Performance indexes for admin/affiliate dashboard load times
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS affiliate_commissions_affiliate_id_idx ON affiliate_commissions (affiliate_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
