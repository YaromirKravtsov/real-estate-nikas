import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header/Header';
import styles from './PropertiesSearchPage.module.scss';
import PropertyCard from '../../layouts/PropertyCard/PropertyCard';

import PropertyService from '../../app/api/service/PropertyService';

import { useTranslations } from '../../store/translations';

type FilterKey = 'location' | 'type' | 'purpose' | 'price';

const purposeMapping: Record<string, string> = {
  sale: 'sale',
  rent: 'rent',
};

const PropertiesSearchPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { translations } = useTranslations();
  const t = translations();

  const locationOptions = [
    { key: 'kyiv', label: t.locationKyiv },
    { key: 'lviv', label: t.locationLviv },
    { key: 'odesa', label: t.locationOdesa },
    { key: 'kharkiv', label: t.locationKharkiv },
  ];

  const typeOptions = [
    { key: 'apartment', label: t.typeApartment },
    { key: 'house', label: t.typeHouse },
    { key: 'commercial', label: t.typeCommercial },
  ];

  const purposeOptions = [
    { key: 'sale', label: t.purposeSale },
    { key: 'rent', label: t.purposeRent },
  ];

  const priceOptions = [
    { key: 'low', label: t.priceLow },
    { key: 'mid', label: t.priceMid },
    { key: 'high', label: t.priceHigh },
  ];

  const filters: { label: string; key: FilterKey; options: { key: string; label: string }[] }[] = [
    { label: t.filterLocation, key: 'location', options: locationOptions },
    { label: t.filterType, key: 'type', options: typeOptions },
    { label: t.filterPurpose, key: 'purpose', options: purposeOptions },
    { label: t.filterPrice, key: 'price', options: priceOptions },
  ];

  const toggleDropdown = (name: FilterKey) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const displayValue = (key: FilterKey) => {
    const selectedKey = selectedFilters[key];
    if (!selectedKey) return '';
    const filter = filters.find(f => f.key === key);
    const option = filter?.options.find(o => o.key === selectedKey);
    return option ? option.label : '';
  };

  const selectOption = (key: FilterKey, optionKey: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: optionKey }));
    setOpenDropdown(null);
  };

  const getPriceRange = (priceKey?: string) => {
    switch (priceKey) {
      case 'low':
        return { priceFrom: undefined, priceTo: 50000 };
      case 'mid':
        return { priceFrom: 50000, priceTo: 100000 };
      case 'high':
        return { priceFrom: 100000, priceTo: 10000000 };
      default:
        return { priceFrom: undefined, priceTo: undefined };
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { priceFrom, priceTo } = getPriceRange(selectedFilters.price);
      const listingType = selectedFilters.purpose ? purposeMapping[selectedFilters.purpose] : undefined;

      const res = await PropertyService.search({
        city: selectedFilters.location,
        listingType,
        propertyType: selectedFilters.type,
        priceFrom,
        priceTo,
        page: 1,
        limit: 100,
      });

      setResult(res.data.data || []);
    } catch (e) {
      alert(t.submitError + ': ' + e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedFilters]);

  return (
    <div className={styles.container}>
      <section className={styles.listingsSection}>
        <div className={styles.sectionLine}></div>
        <h2 className={styles.listingsTitle}>{t.listingsTitle}</h2>

        <div className={styles.filters}>
          {filters.map(({ label, key, options }) => (
            <div
              key={key}
              className={styles.filterItem}
              onClick={() => toggleDropdown(key)}
            >
              <span>{displayValue(key) || label}</span>
              <span>▾</span>
              {openDropdown === key && (
                <ul className={styles.dropdown}>
                  {options.map(({ key: optionKey, label }) => (
                    <li
                      key={optionKey}
                      className={styles.dropdownItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectOption(key, optionKey);
                      }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {!loading && result?.length === 0 && <p>{t.nothingFound}</p>}

        <div className={styles.resultsGrid}>
          {result?.map((item: any) => (
            <PropertyCard
              key={item.id}
              id={item.id}
              imageUrl={`${item.images?.[0]?.imageUrl || 'default.jpg'}`}
              title={item.title}
              price={item.price}
              address={`${item.city}, ${item.address}`}
              bedrooms={item.bedrooms}
              bathrooms={item.bathrooms}
              listingType={item.listingType}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PropertiesSearchPage;
