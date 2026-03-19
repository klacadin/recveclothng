/**
 * Philippine Standard Geographic Code (PSGC) API
 * Source: https://psgc.gitlab.io/api/ (PSA data)
 * Region → Province/District → City/Municipality → Barangay
 */
const PSGC_BASE = 'https://psgc.gitlab.io/api';

export interface PSGCRegion {
  code: string;
  name: string;
  regionName: string;
  islandGroupCode: string;
}

export interface PSGCProvince {
  code: string;
  name: string;
  regionCode: string;
  islandGroupCode: string;
}

export interface PSGCDistrict {
  code: string;
  name: string;
  regionCode: string;
  islandGroupCode: string;
}

export interface PSGCCityMunicipality {
  code: string;
  name: string;
  provinceCode?: string | false;
  districtCode?: string | false;
  regionCode: string;
  isCity?: boolean;
  isMunicipality?: boolean;
}

export interface PSGCBarangay {
  code: string;
  name: string;
  municipalityCode?: string | false;
  cityCode?: string | false;
  provinceCode: string;
  regionCode: string;
}

const NCR_REGION_CODE = '130000000';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PSGC API error: ${res.status}`);
  return res.json();
}

export async function fetchRegions(): Promise<PSGCRegion[]> {
  return fetchJson<PSGCRegion[]>(`${PSGC_BASE}/regions.json`);
}

export async function fetchProvinces(regionCode: string): Promise<PSGCProvince[]> {
  return fetchJson<PSGCProvince[]>(`${PSGC_BASE}/regions/${regionCode}/provinces.json`);
}

export async function fetchCitiesByRegion(regionCode: string): Promise<PSGCCityMunicipality[]> {
  return fetchJson<PSGCCityMunicipality[]>(`${PSGC_BASE}/regions/${regionCode}/cities-municipalities.json`);
}

export async function fetchCitiesByProvince(provinceCode: string): Promise<PSGCCityMunicipality[]> {
  return fetchJson<PSGCCityMunicipality[]>(`${PSGC_BASE}/provinces/${provinceCode}/cities-municipalities.json`);
}

export async function fetchCitiesByDistrict(districtCode: string): Promise<PSGCCityMunicipality[]> {
  return fetchJson<PSGCCityMunicipality[]>(`${PSGC_BASE}/districts/${districtCode}/cities-municipalities.json`);
}

export async function fetchBarangays(cityMunicipalityCode: string): Promise<PSGCBarangay[]> {
  return fetchJson<PSGCBarangay[]>(`${PSGC_BASE}/cities-municipalities/${cityMunicipalityCode}/barangays.json`);
}

export interface AddressSelections {
  regionCode: string;
  regionName: string;
  /** PSGC island group code (usually 01 Luzon, 02 Visayas, 03 Mindanao) */
  islandGroupCode: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  barangayCode: string;
  barangayName: string;
}

/** Build full address string for display/shipping */
export function buildAddressString(
  street: string,
  selections: Partial<AddressSelections>
): string {
  const parts: string[] = [];
  if (street?.trim()) parts.push(street.trim());
  if (selections.barangayName) parts.push(selections.barangayName);
  if (selections.cityName) parts.push(selections.cityName);
  if (selections.provinceName) parts.push(selections.provinceName);
  if (selections.regionName && selections.regionName !== selections.provinceName) {
    parts.push(selections.regionName);
  }
  return parts.join(', ');
}
