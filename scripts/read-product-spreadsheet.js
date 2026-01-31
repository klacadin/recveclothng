import XLSX from "xlsx";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "src", "data");

const path = "C:\\Documents\\Reve\\REVE CLOTHING - Spreadsheet3.xlsx";
const workbook = XLSX.readFile(path);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

// Header row is 0; product rows start at 1. Category rows have CODE in [SHRT, SHORT, SING, LSLV].
const CATEGORY_CODES = ["SHRT", "SHORT", "SING", "LSLV"];
const categoryPrices = {};
let currentCategory = null;
let currentCategoryPrice = null;
let currentCategorySpecs = "";
let currentCategoryWhy = "";
let currentCategoryConvenienceFee = null;
let currentCategorySizeStocks = { XS: 10, S: 10, M: 10, L: 10, XL: 10, XXL: 5, XXXL: 5 };
const products = [];

const parseNum = (v) => {
  const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
  return isNaN(n) ? null : n;
};

for (let i = 1; i < data.length; i++) {
  const row = data[i];
  const cat = (row.CATEGORIES || "").trim();
  const code = (row.CODE || "").trim();
  const name = (row.NAME || "").trim();

  // Skip shipping/returns section
  if (cat.includes("SHIPPING") || cat.includes("Returns") || (row.SIZES && String(row.SIZES).includes("working days"))) break;
  if (!code && !name && !cat) continue;

  if (CATEGORY_CODES.includes(code) && !name) {
    currentCategory = cat;
    currentCategoryPrice = (row.Price || "").replace(/[^\d.]/g, "") || null;
    if (currentCategoryPrice) categoryPrices[currentCategory] = parseFloat(currentCategoryPrice);
    currentCategorySpecs = (row.SPECS || "").trim();
    currentCategoryWhy = (row["WHY Customers Buy"] || "").trim();
    const feeStr = (row["Convenience Fee"] || "").replace(/[^\d.]/g, "");
    currentCategoryConvenienceFee = feeStr ? parseFloat(feeStr) : null;
    currentCategorySizeStocks = {
      XS: parseNum(row.__EMPTY_1) ?? 10,
      S: parseNum(row.__EMPTY_2) ?? 10,
      M: parseNum(row.__EMPTY_3) ?? 10,
      L: parseNum(row.__EMPTY_4) ?? 10,
      XL: parseNum(row.__EMPTY_5) ?? 10,
      XXL: parseNum(row.__EMPTY_6) ?? 5,
      XXXL: parseNum(row.__EMPTY_7) ?? 5,
    };
    continue;
  }

  if (currentCategory && name && code && !CATEGORY_CODES.includes(code)) {
    const priceStr = (row.Price || "").trim();
    const price = priceStr ? parseFloat(priceStr.replace(/[^\d.]/g, "")) : (categoryPrices[currentCategory] || null);
    products.push({
      category: currentCategory,
      name,
      code,
      price,
      description: (row.DESCRIPTION || "").trim(),
      specs: currentCategorySpecs,
      whyCustomersBuy: currentCategoryWhy,
      convenienceFee: currentCategoryConvenienceFee,
      sizeStocks: currentCategorySizeStocks,
      sizes: { XS: row.__EMPTY_1, S: row.__EMPTY_2, M: row.__EMPTY_3, L: row.__EMPTY_4, XL: row.__EMPTY_5, XXL: row.__EMPTY_6, XXXL: row.__EMPTY_7 },
    });
  }
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "products-from-spreadsheet.json");
writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log("Category prices:", categoryPrices);
console.log("Products count:", products.length);
console.log("Wrote", outPath);
