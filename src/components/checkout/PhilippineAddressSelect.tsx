import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
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

  const isNCR = value.regionCode === NCR_REGION_CODE;
  const isNCRWithCitiesDirect = isNCR; // NCR: Region → City → Barangay (skip province)

  const loadRegions = useCallback(async () => {
    setLoading('regions');
    setError(null);
    try {
      const data = await fetchRegions();
      setRegions(data);
    } catch (e) {
      setError('Failed to load regions. Please check your connection.');
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
      islandGroupCode: (region as any)?.islandGroupCode ?? '',
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
    </div>
  );
};

export default PhilippineAddressSelect;
