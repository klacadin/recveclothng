/**
 * Product data from REVE CLOTHING - Spreadsheet3.xlsx.
 * Images from src/assets/reve-clothing-products-batch1/ (see productImageMap.ts).
 * Regenerate JSON: npm run script scripts/read-product-spreadsheet.js (or add npm script).
 */
import productsFromSpreadsheet from "./products-from-spreadsheet.json";
import { CANONICAL_PRODUCT_CODES, productCodeToImageFilename } from "./productImageMap";
import { getProductImageUrl } from "./productImages";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export type SpreadsheetProduct = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  description: string;
  specs: string;
  whyCustomersBuy: string;
  sizes: Record<string, string>;
  image: string;
};

type SpreadsheetRow = {
  category: string;
  name: string;
  code: string;
  price: number;
  description: string;
  specs: string;
  whyCustomersBuy: string;
  sizes: Record<string, string>;
};

function buildProducts(): SpreadsheetProduct[] {
  const rows = productsFromSpreadsheet as SpreadsheetRow[];
  const canonical = rows.filter((p) => CANONICAL_PRODUCT_CODES.includes(p.code));
  return canonical.map((p) => {
    const filename = productCodeToImageFilename[p.code] ?? "";
    const image = filename ? getProductImageUrl(filename) : PLACEHOLDER_IMAGE;
    return {
      id: p.code,
      code: p.code,
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description ?? "",
      specs: p.specs ?? "",
      whyCustomersBuy: p.whyCustomersBuy ?? "",
      sizes: p.sizes ?? {},
      image: image || PLACEHOLDER_IMAGE,
    };
  });
}

const _products = buildProducts();

/** All products from the spreadsheet (NOBODY collection: Running Shirt, Shorts, Singlets, Long Sleeves). */
export const NOBODY_PRODUCTS = _products;

/** Get products by sub-category (e.g. "Running Shirt", "Running Shorts"). */
export function getProductsByCategory(category: string): SpreadsheetProduct[] {
  return _products.filter((p) => p.category === category);
}

/** Get product by id (code). */
export function getProductById(id: string): SpreadsheetProduct | undefined {
  return _products.find((p) => p.id === id || p.code === id);
}

export { customerJourneyImage } from "./productImages";
