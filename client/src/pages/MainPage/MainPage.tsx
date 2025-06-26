import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header/Header';
import styles from './MainPage.module.scss';
import PropertyCard from '../../layouts//PropertyCard/PropertyCard';

import heroImage from '../../assets/images/hero-house.jpeg';
import trustImage from '../../assets/images/people-meeting.jpg';

import PropertyService from '../../app/api/service/PropertyService';
import { useLocation } from 'react-router-dom';
import { useTranslations } from '../../store/translations';

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
  const location = useLocation();
  const { translations } = useTranslations();
  const t = translations();

  const filters: { label: string; key: FilterKey; options: string[] }[] = [
    { label: 'Місце розташування', key: 'location', options: ['Київ', 'Львів', 'Одеса', 'Харків'] },
    { label: 'Тип нерухомості', key: 'type', options: ['Квартира', 'Будинок', 'Комерційна'] },
    { label: 'Шукаєте', key: 'purpose', options: ['Купівля', 'Оренда'] },
    { label: 'Ціна', key: 'price', options: ['< $50,000', '$50,000–$100,000', '> $100,000'] },
  ];

  
  useEffect(()=>{
    if(location.pathname == '/'){
      document.body.classList.add('mainPage')

    return () => document.body.classList.remove('mainPage')
    }
  },[location.pathname])
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
          limit: 100,
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
      <section className={styles.topContainer}
        style={{ backgroundImage: `url(${heroImage})` }}
      >

        <section
          className={styles.heroSection}
        >
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}> {t.heroTitle} </h1>
            <p className={styles.heroDescription}> {t.heroDescription} </p>
          </div>
        </section>
      </section>
      {/* Trust Section */}
      <section className={styles.trustSection}>
        <img src={trustImage} alt="Trust" className={styles.trustImage} />
        <div className={styles.trustContent}>
          <div className={styles.sectionLine}></div>
          <h2 className={styles.trustTitle}> {t.trustTitle}</h2>
          <p className={styles.trustDescription}> {t.trustDescription} </p>
          <button className={styles.learnMoreButton}> {t.learnMore} </button>
        </div>
      </section>

      {/* Listings Section */}
      <section className={styles.listingsSection}>
        <div className={styles.sectionLine}></div>
        <h2 className={styles.listingsTitle}> {t.listingsTitle} </h2>

        {/* 
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
        </div> */}

        {/* Search Result */}
        {!loading && result?.length === 0 && <p>Нічого не знайдено</p>}

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

export default MainPage;
