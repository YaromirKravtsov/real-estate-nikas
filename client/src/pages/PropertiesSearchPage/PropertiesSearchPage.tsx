import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header/Header';
import styles from './PropertiesSearchPage.module.scss';
import PropertyCard from '../../layouts/PropertyCard/PropertyCard';

import PropertyService from '../../app/api/service/PropertyService';

import { useTranslations } from '../../store/translations';

type FilterKey = 'location' | 'type' | 'purpose' | 'price';

const purposeMapping: Record<string, string> = {
  'Купівля': 'sale',
  'Оренда': 'rent',
};

const PropertiesSearchPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { translations } = useTranslations();
  const t = translations();

  const toggleDropdown = (name: FilterKey) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const selectOption = (key: FilterKey, option: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: option }));
    setOpenDropdown(null);
  };

 const filters: { label: string; key: FilterKey; options: string[] }[] = [
    { label: t.filterLocation, key: 'location', options: ['Київ', 'Львів', 'Одеса', 'Харків'] },
    { label: t.filterType, key: 'type', options: ['Квартира', 'Будинок', 'Комерційна'] },
    { label: t.filterPurpose, key: 'purpose', options: ['Купівля', 'Оренда'] },
    { label: t.filterPrice, key: 'price', options: ['< $50,000', '$50,000–$100,000', '> $100,000'] },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const priceRange = selectedFilters.price;
      let priceFrom, priceTo;

      if (priceRange === '< $50,000') {
        priceTo = 50000;
      } else if (priceRange === '$50,000–$100,000') {
        priceFrom = 50000;
        priceTo = 100000;
      } else if (priceRange === '> $100,000') {
        priceFrom = 100000;
        priceTo = 10000000;
      }

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
      alert('Помилка пошуку: ' + e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const priceRange = selectedFilters.price;
        let priceFrom, priceTo;

        if (priceRange === '< $50,000') {
          priceTo = 50000;
        } else if (priceRange === '$50,000–$100,000') {
          priceFrom = 50000;
          priceTo = 100000;
        } else if (priceRange === '> $100,000') {
          priceFrom = 100000;
          priceTo = 10000000;
        }

        const listingType = selectedFilters.purpose ? purposeMapping[selectedFilters.purpose] : undefined;

        const res = await PropertyService.search({
        city: selectedFilters.location,
        listingType,
        propertyType: selectedFilters.type,
        priceFrom,
        priceTo,
        page: 1,
       limit: 100
      });

        setResult(res.data.data || []);
      } catch (e) {
        alert('Помилка пошуку: ' + e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
              <span>{selectedFilters[key] || label}</span>
              <span>▾</span>
              {openDropdown === key && (
                <ul className={styles.dropdown}>
                  {options.map((option) => (
                    <li
                      key={option}
                      className={styles.dropdownItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectOption(key, option);
                      }}
                    >
                      {option}
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
