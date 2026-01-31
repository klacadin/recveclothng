/**
 * Canonical product list and image map (from REVE CLOTHING spreadsheet).
 * Only these products are shown; dummy/other rows are excluded.
 * Images in src/assets/reve-clothing-products-batch1/
 */
export const CANONICAL_PRODUCT_CODES: string[] = [
  // Running Shirt (12)
  "SHRT-HLDL",
  "SHRT-YY",
  "SHRT-BLK",
  "SHRT-KRU",
  "SHRT-NBDY",
  "SHRT-ORNG",
  "SHRT-PNKF",
  "SHRT-PUNK",
  "SHRT-BCRK",
  "SHRT-JLLYF",
  "SHRT-PCH",
  "SHRT-MNPNK",
  // Running Shorts (2)
  "SHORT-PNK",
  "SHORT-BLK",
  // Running Singlets (20)
  "SING-AVC",
  "SING-YINY",
  "SING-CLRSP",
  "SING-TLB",
  "SING-PCH",
  "SING-BLKGR",
  "SING-BLKTRB",
  "SING-CRSHC",
  "SING-FAITH",
  "SING-GRNOM",
  "SING-JLLY",
  "SING-ORNG",
  "SING-PNKF1",
  "SING-PNKF2",
  "SING-PNKGRN",
  "SING-PNKPRP",
  "SING-PUNK",
  "SING-PRPL",
  "SING-MNDLP",
  "SING-DNM",
  // Running Long Sleeves (2)
  "LSLV-TRBG",
  "LSLV-BLK",
];

export const productCodeToImageFilename: Record<string, string> = {
  // Running Shirt
  "SHRT-HLDL": "tshirt-healty-living.webp",
  "SHRT-YY": "tshirt-yin-and-yang.webp",
  "SHRT-BLK": "tshirt-black.webp",
  "SHRT-KRU": "tshirt-kru-kru.webp",
  "SHRT-NBDY": "tshirt-nbdy.webp",
  "SHRT-ORNG": "tshirt-orange.webp",
  "SHRT-PNKF": "tshirt-pink-floral.webp",
  "SHRT-PUNK": "tshirt-punk.webp",
  "SHRT-BCRK": "tshirt-black-crak.webp",
  "SHRT-JLLYF": "tshirt-jelly-fish.webp",
  "SHRT-PCH": "tshirt-peach.webp",
  "SHRT-MNPNK": "tshirt-manddala-pink.webp",
  // Running Shorts
  "SHORT-PNK": "short-pink.webp",
  "SHORT-BLK": "short-black-2.webp",
  // Running Singlets
  "SING-AVC": "",
  "SING-YINY": "singlet-yin-and-yang.webp",
  "SING-CLRSP": "singlet-white-colord.webp",
  "SING-TLB": "singlet-teel-blue.webp",
  "SING-PCH": "singlet-peach.webp",
  "SING-BLKGR": "singlet-black-green.webp",
  "SING-BLKTRB": "singlet-black-tribal.webp",
  "SING-CRSHC": "singlet-crush-colord.webp",
  "SING-FAITH": "singlet-faith-over-fear.webp",
  "SING-GRNOM": "singlet-green-ombrey.webp",
  "SING-JLLY": "singlet-jelleyfish.webp",
  "SING-ORNG": "singlet-orange.webp",
  "SING-PNKF1": "singlet-pink-floral.webp",
  "SING-PNKF2": "singlet-pink-floral-2.webp",
  "SING-PNKGRN": "singlet-pink-green.webp",
  "SING-PNKPRP": "singlet-pink-purple.webp",
  "SING-PUNK": "singlet-punk.webp",
  "SING-PRPL": "singlet-purple.webp",
  "SING-MNDLP": "singlet-mandala-pink.webp",
  "SING-DNM": "singlet-denim.webp",
  // Running Long Sleeves – no batch1 images
  "LSLV-TRBG": "",
  "LSLV-BLK": "",
};
