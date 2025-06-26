import React, { useEffect, useState } from 'react';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import styles from './PropertiesPage.module.css';
import $api from '../../app/api/http';
import { IPaginatedResponse, IProperty, SearchPropertyDto } from '../../models/IProperty';
import PropertiesList from './components/PropertiesList';
import PropertySearchBar from './components/PropertySearchBar';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../app/router';
import { useTranslations } from '../../store/translations';

const PropertiesPage: React.FC = () => {
  const { translations } = useTranslations();
  const t = translations();

  const [filters, setFilters] = useState<SearchPropertyDto>({
    city: '',
    listingType: undefined,
    propertyType: '',
    priceFrom: undefined,
    priceTo: undefined,
    page: 1,
    limit: 100,
  });

  const [response, setResponse] = useState<IPaginatedResponse<IProperty> | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    try {
      const { data } = await $api.get<IPaginatedResponse<IProperty>>(
        `/properties/search?${params.toString()}`
      );
      setResponse(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const onSearch = (newFilters: Partial<SearchPropertyDto>) => {
    setFilters(f => ({
      ...f,
      ...newFilters,
      page: 1,
    }));
  };

  return (
    <PageLayout
      pageTitle={t.propertiesPageTitle}
      actionTitle={t.propertiesAddButton}
      action={() => navigate(RouteNames.PROPERTY)}
    >
      <div className={styles.main}>
        <PropertySearchBar filters={filters} onSearch={onSearch} />
        {loading ? (
          <p>{t.propertiesLoading}</p>
        ) : (
          <PropertiesList properties={response?.data || []} />
        )}
      </div>
    </PageLayout>
  );
};

export default PropertiesPage;
