#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputDir = join(rootDir, 'exports');

async function loadEnv() {
  try {
    const dotenv = await import('dotenv');
    (dotenv.default || dotenv).config?.({ path: join(rootDir, '.env') });
  } catch {
    // optional
  }
}

const csvEscape = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const toIsoOrEmpty = (value) => (value ? new Date(value).toISOString() : '');

async function fetchAllOrders(supabase) {
  const pageSize = 1000;
  const all = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

async function main() {
  await loadEnv();

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const beforeArg = process.argv.find((arg) => arg.startsWith('--before='));
  const beforeDate = beforeArg ? new Date(beforeArg.slice('--before='.length)) : null;
  if (!url) throw new Error('Missing VITE_SUPABASE_URL');
  if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  if (beforeDate && Number.isNaN(beforeDate.getTime())) {
    throw new Error('Invalid --before date. Use YYYY-MM-DD or an ISO timestamp.');
  }

  mkdirSync(outputDir, { recursive: true });

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const orders = await fetchAllOrders(supabase);
  const filteredOrders = beforeDate
    ? orders.filter((order) => new Date(order.created_at) < beforeDate)
    : orders;
  const orderRows = [];
  const itemRows = [];

  for (const order of filteredOrders) {
    const items = Array.isArray(order.order_items) ? order.order_items : [];
    orderRows.push({
      order_number: order.order_number,
      created_at: toIsoOrEmpty(order.created_at),
      updated_at: toIsoOrEmpty(order.updated_at),
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone ?? '',
      status: order.status,
      payment_method: order.payment_method,
      subtotal: order.subtotal,
      shipping_fee: order.shipping_fee,
      total: order.total,
      item_count: items.length,
      waybill_number: order.waybill_number ?? '',
      payment_reference_number: order.payment_reference_number ?? '',
      proof_of_payment_url: order.proof_of_payment_url ?? '',
      notes: order.notes ?? '',
      user_id: order.user_id ?? '',
    });

    for (const item of items) {
      itemRows.push({
        order_number: order.order_number,
        order_created_at: toIsoOrEmpty(order.created_at),
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        status: order.status,
        payment_method: order.payment_method,
        product_name: item.product_name,
        product_sku: item.product_sku ?? '',
        size: item.size ?? '',
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        product_id: item.product_id ?? '',
      });
    }
  }

  const summaryRows = [
    { metric: 'total_orders', value: filteredOrders.length },
    { metric: 'total_line_items', value: itemRows.length },
    { metric: 'gross_sales', value: filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0) },
    { metric: 'paid_or_completed_sales', value: filteredOrders.filter((o) => ['paid', 'preparing', 'packed', 'for_pickup', 'shipped', 'completed'].includes(o.status)).reduce((sum, order) => sum + Number(order.total || 0), 0) },
  ];

  const workbook = XLSX.utils.book_new();
  const ordersSheet = XLSX.utils.json_to_sheet(orderRows);
  const itemsSheet = XLSX.utils.json_to_sheet(itemRows);
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'summary');
  XLSX.utils.book_append_sheet(workbook, ordersSheet, 'orders');
  XLSX.utils.book_append_sheet(workbook, itemsSheet, 'order_items');

  const suffix = beforeDate ? `-before-${beforeDate.toISOString().slice(0, 10)}` : '';
  const datedName = `sales-export${suffix}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const ordersCsvName = `sales-orders${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const itemsCsvName = `sales-order-items${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const finalXlsxPath = join(outputDir, datedName);
  writeFileSync(finalXlsxPath, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));

  const ordersCsv = [
    Object.keys(orderRows[0] || { order_number: '' }).join(','),
    ...orderRows.map((row) => Object.values(row).map(csvEscape).join(',')),
  ].join('\n');
  const itemsCsv = [
    Object.keys(itemRows[0] || { order_number: '' }).join(','),
    ...itemRows.map((row) => Object.values(row).map(csvEscape).join(',')),
  ].join('\n');

  writeFileSync(join(outputDir, ordersCsvName), ordersCsv);
  writeFileSync(join(outputDir, itemsCsvName), itemsCsv);

  console.log(JSON.stringify({
    orders: filteredOrders.length,
    items: itemRows.length,
    cutoff: beforeDate ? beforeDate.toISOString() : null,
    xlsxPath: finalXlsxPath,
    ordersCsvPath: join(outputDir, ordersCsvName),
    itemsCsvPath: join(outputDir, itemsCsvName),
  }, null, 2));
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
