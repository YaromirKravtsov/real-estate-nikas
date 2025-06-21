import React, { useState, useEffect } from 'react';
import Header from '../../layouts/AdminHeader/AdminHeader';
import styles from './MainPage.module.scss';
import PropertyCard from '../../layouts//PropertyCard/PropertyCard';


import heroImage from '../../assets/images/hero-house.jpeg';
import trustImage from '../../assets/images/people-meeting.jpg';

import { searchProperties } from '../../app/api/property';

type FilterKey = 'location' | 'type' | 'purpose' | 'price';

const purposeMapping: Record<string, string> = {
  'Купівля': 'sale',
  'Оренда': 'rent',
};

const MainPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = (name: FilterKey) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const selectOption = (key: FilterKey, option: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: option }));
    setOpenDropdown(null);
  };

  const filters: { label: string; key: FilterKey; options: string[] }[] = [
    { label: 'Місце розташування', key: 'location', options: ['Київ', 'Львів', 'Одеса', 'Харків'] },
    { label: 'Тип нерухомості', key: 'type', options: ['Квартира', 'Будинок', 'Комерційна'] },
    { label: 'Шукаєте', key: 'purpose', options: ['Купівля', 'Оренда'] },
    { label: 'Ціна', key: 'price', options: ['< $50,000', '$50,000–$100,000', '> $100,000'] },
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

       const res = await searchProperties({
        city: selectedFilters.location,
        listingType, 
        propertyType: selectedFilters.type,
        priceFrom,
        priceTo,
        page: 1,
        limit: 6,
      });

      setResult(res.data || []);
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

        const res = await searchProperties({
          city: selectedFilters.location,
          listingType,
          propertyType: selectedFilters.type,
          priceFrom,
          priceTo,
          page: 1,
          limit: 6,
        });

        setResult(res.data || []);
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
      <section
        className={styles.heroSection}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Чудові оселі, створені для вас</h1>
          <p className={styles.heroDescription}>
            На перший погляд здається, що все це має значення, адже найбільше задоволення приносить можливість творити. Ми здатні зробити все, що потрібно, докладаючи зусиль і точності, і саме це формує справжню основу наших дій.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <img src={trustImage} alt="Trust" className={styles.trustImage} />
        <div className={styles.trustContent}>
          <div className={styles.sectionLine}></div>
          <h2 className={styles.trustTitle}>Ви в надійних руках</h2>
          <p className={styles.trustDescription}>
              Наш підхід — це більше, ніж просто слова. Ми дбаємо про кожен аспект, щоб захистити вас від ризиків і забезпечити максимальний комфорт. Як досвідчені провідники у світі нерухомості, ми відкриваємо те, що раніше залишалося прихованим — від реальної цінності до справжнього задоволення.
          </p>
          <button className={styles.learnMoreButton}>Learn more</button>
        </div>
      </section>

      {/* Listings Section */}
      <section className={styles.listingsSection}>
        <div className={styles.sectionLine}></div>
        <h2 className={styles.listingsTitle}>Знайдіть своє нове місце для життя</h2>

        {/* Filters */}
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

        {/* Search Result */}
        {!loading && result?.length === 0 && <p>Нічого не знайдено</p>}

        <div className={styles.resultsGrid}>
          {result?.map((item: any) => (
            <PropertyCard
              key={item.id}
              imageUrl={`/uploads/${item.images?.[0]?.imageUrl || 'default.jpg'}`}
              title={item.title}
              price={item.price}
              address={`${item.city}, ${item.address}`}
              bedrooms={item.bedrooms}
              bathrooms={item.bathrooms}
              area="6x8 m²"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
