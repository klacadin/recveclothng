import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchRegions,
  fetchProvinces,
  fetchCitiesByProvince,
  fetchCitiesByRegion,
  fetchBarangays,
  type AddressSelections,
  type PSGCRegion,
  type PSGCProvince,
  type PSGCCityMunicipality,
  type PSGCBarangay,
} from '@/hooks/usePhilippineAddress';

const NCR_REGION_CODE = '130000000';

interface PhilippineAddressSelectProps {
  value: Partial<AddressSelections>;
  onChange: (selections: Partial<AddressSelections>) => void;
  disabled?: boolean;
  className?: string;
}

const PhilippineAddressSelect = ({
  value,
  onChange,
  disabled = false,
  className = '',
}: PhilippineAddressSelectProps) => {
  const [regions, setRegions] = useState<PSGCRegion[]>([]);
  const [provinces, setProvinces] = useState<PSGCProvince[]>([]);
  const [cities, setCities] = useState<PSGCCityMunicipality[]>([]);
  const [barangays, setBarangays] = useState<PSGCBarangay[]>([]);
  const [loading, setLoading] = useState<'regions' | 'provinces' | 'cities' | 'barangays' | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Fallback: when the PSGC location API is unreachable, let customers type their address manually.
  const [manualMode, setManualMode] = useState(false);

  const isNCR = value.regionCode === NCR_REGION_CODE;
  const isNCRWithCitiesDirect = isNCR; // NCR: Region → City → Barangay (skip province)

  // Manual entry uses sentinel codes so the checkout schema (which requires non-empty
  // region/province/city/barangay codes) still passes while we keep the typed names.
  const handleManualChange = (
    field: 'regionName' | 'provinceName' | 'cityName' | 'barangayName',
    text: string,
  ) => {
    const codeField = field.replace('Name', 'Code') as
      | 'regionCode'
      | 'provinceCode'
      | 'cityCode'
      | 'barangayCode';
    onChange({
      ...value,
      [field]: text,
      [codeField]: text.trim() ? `manual:${field}` : '',
    });
  };

  const enableManualMode = useCallback(() => {
    setManualMode(true);
    setError(null);
    setLoading(null);
    // Reset any partial PSGC selections so manual values start clean.
    onChange({
      regionCode: '',
      regionName: '',
      islandGroupCode: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      barangayCode: '',
      barangayName: '',
    });
  }, [onChange]);

  const loadRegions = useCallback(async () => {
    setLoading('regions');
    setError(null);
    try {
      const data = await fetchRegions();
      setRegions(data);
      setManualMode(false);
    } catch (e) {
      // API unreachable (e.g. DNS/name resolution failure) — fall back to manual entry
      // so customers can still complete checkout.
      setError('We could not load the address list. Please enter your address manually below.');
      setManualMode(true);
    } finally {
      setLoading(null);
    }
  }, []);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  useEffect(() => {
    if (!value.regionCode) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      return;
    }
    const load = async () => {
      setLoading('provinces');
      setError(null);
      try {
        if (value.regionCode === NCR_REGION_CODE) {
          const data = await fetchCitiesByRegion(value.regionCode);
          setCities(data);
          setProvinces([]);
        } else {
          const data = await fetchProvinces(value.regionCode);
          setProvinces(data);
          setCities([]);
        }
        setBarangays([]);
      } catch (e) {
        setError('Failed to load locations.');
      } finally {
        setLoading(null);
      }
    };
    load();
  }, [value.regionCode]);

  useEffect(() => {
    if (isNCRWithCitiesDirect) return;
    if (!value.provinceCode) {
      setCities([]);
      setBarangays([]);
      return;
    }
    const load = async () => {
      setLoading('cities');
      setError(null);
      try {
        const data = await fetchCitiesByProvince(value.provinceCode);
        setCities(data);
        setBarangays([]);
      } catch (e) {
        setError('Failed to load cities/municipalities.');
      } finally {
        setLoading(null);
      }
    };
    load();
  }, [value.provinceCode, isNCRWithCitiesDirect]);

  useEffect(() => {
    if (!value.cityCode) {
      setBarangays([]);
      return;
    }
    const load = async () => {
      setLoading('barangays');
      setError(null);
      try {
        const data = await fetchBarangays(value.cityCode);
        setBarangays(data);
      } catch (e) {
        setError('Failed to load barangays.');
      } finally {
        setLoading(null);
      }
    };
    load();
  }, [value.cityCode]);

  const handleRegionChange = (code: string) => {
    const region = regions.find((r) => r.code === code);
    onChange({
      ...value,
      regionCode: code,
      regionName: region?.name ?? '',
      islandGroupCode: region?.islandGroupCode ?? '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      barangayCode: '',
      barangayName: '',
    });
  };

  const handleProvinceChange = (code: string) => {
    const prov = provinces.find((p) => p.code === code);
    onChange({
      ...value,
      provinceCode: code,
      provinceName: prov?.name ?? '',
      cityCode: '',
      cityName: '',
      barangayCode: '',
      barangayName: '',
    });
  };

  const handleCityChange = (code: string) => {
    const city = cities.find((c) => c.code === code);
    onChange({
      ...value,
      cityCode: code,
      cityName: city?.name ?? '',
      barangayCode: '',
      barangayName: '',
    });
  };

  const handleBarangayChange = (code: string) => {
    const brgy = barangays.find((b) => b.code === code);
    onChange({
      ...value,
      barangayCode: code,
      barangayName: brgy?.name ?? '',
    });
  };

  const provinceOptions = provinces;
  const provinceLabel = 'Province';

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {manualMode ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="manual-region">Region *</Label>
              <Input
                id="manual-region"
                value={value.regionName ?? ''}
                onChange={(e) => handleManualChange('regionName', e.target.value)}
                placeholder="e.g. Region X (Northern Mindanao)"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-province">Province *</Label>
              <Input
                id="manual-province"
                value={value.provinceName ?? ''}
                onChange={(e) => handleManualChange('provinceName', e.target.value)}
                placeholder="e.g. Bukidnon"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-city">City / Municipality *</Label>
              <Input
                id="manual-city"
                value={value.cityName ?? ''}
                onChange={(e) => handleManualChange('cityName', e.target.value)}
                placeholder="e.g. Maramag"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-barangay">Barangay *</Label>
              <Input
                id="manual-barangay"
                value={value.barangayName ?? ''}
                onChange={(e) => handleManualChange('barangayName', e.target.value)}
                placeholder="e.g. Poblacion"
                disabled={disabled}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={loadRegions}
            disabled={disabled || loading === 'regions'}
          >
            {loading === 'regions' ? 'Loading address list…' : 'Try loading the address list again'}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Region *</Label>
          <Select
            value={value.regionCode || ''}
            onValueChange={handleRegionChange}
            disabled={disabled || loading === 'regions'}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading === 'regions' ? 'Loading...' : 'Select region'} />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isNCRWithCitiesDirect && (
          <div className="space-y-2">
            <Label>{provinceLabel} *</Label>
            <Select
              value={value.provinceCode || ''}
              onValueChange={handleProvinceChange}
              disabled={disabled || !value.regionCode || loading === 'provinces'}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !value.regionCode
                      ? `Select region first`
                      : loading === 'provinces'
                        ? 'Loading...'
                        : `Select ${provinceLabel.toLowerCase()}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {provinceOptions.map((p) => (
                  <SelectItem key={p.code} value={p.code}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>City / Municipality *</Label>
          <Select
            value={value.cityCode || ''}
            onValueChange={handleCityChange}
            disabled={
              disabled ||
              (isNCRWithCitiesDirect ? !value.regionCode || loading === 'provinces' : !value.provinceCode || loading === 'cities')
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isNCRWithCitiesDirect
                    ? !value.regionCode
                      ? 'Select region first'
                      : loading === 'provinces'
                        ? 'Loading...'
                        : 'Select city'
                    : !value.provinceCode
                      ? `Select ${provinceLabel.toLowerCase()} first`
                      : loading === 'cities'
                        ? 'Loading...'
                        : 'Select city/municipality'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Barangay *</Label>
          <Select
            value={value.barangayCode || ''}
            onValueChange={handleBarangayChange}
            disabled={disabled || !value.cityCode || loading === 'barangays'}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  !value.cityCode
                    ? 'Select city first'
                    : loading === 'barangays'
                      ? 'Loading...'
                      : 'Select barangay'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {barangays.map((b) => (
                <SelectItem key={b.code} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={enableManualMode}
            disabled={disabled}
          >
            Can&apos;t find your address? Enter it manually
          </Button>
        </>
      )}
    </div>
  );
};

export default PhilippineAddressSelect;
