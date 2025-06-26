import React, { useState } from 'react';
import styles from '../PropertiesPage.module.css';
import { SearchPropertyDto } from '../../../models/IProperty';
import MyInput from '../../../UI/MyInput/MyInput';
import MyButton from '../../../UI/MyButton/MyButton';
import MySelect from '../../../UI/MySelect/MySelect';
import { useTranslations } from '../../../store/translations';

interface Props {
  filters: SearchPropertyDto;
  onSearch: (newFilters: Partial<SearchPropertyDto>) => void;
}

const PropertySearchBar: React.FC<Props> = ({ filters, onSearch }) => {
  const { translations } = useTranslations();
  const t = translations();

  const listingOptions = [
    { value: 'sale', label: t.sale },
    { value: 'rent', label: t.rent },
  ];

  const [local, setLocal] = useState<SearchPropertyDto>(filters);

  const handleChange = (key: keyof SearchPropertyDto, value: any) => {
    const newFilters = { ...local, [key]: value };
    setLocal(newFilters);
    onSearch(newFilters);
  };

  const submit = () => {
    onSearch(local);
  };

  return (
    <div className={styles.searchBar}>
      <MySelect
        placeholder={t.listingType}
        options={listingOptions}
        value={local.listingType}
        onChange={v => handleChange('listingType', v)}
      />
      <MyInput
        placeholder={`${t.price} ${t.from?.toLowerCase?.() || ''}`}
        value={local.priceFrom?.toString() || ''}
        setValue={v => handleChange('priceFrom', Number(v) || undefined)}
        type="number"
        className={styles.price}
      />
      <MyInput
        placeholder={`${t.price} ${t.to?.toLowerCase?.() || ''}`}
        value={local.priceTo?.toString() || ''}
        setValue={v => handleChange('priceTo', Number(v) || undefined)}
        type="number"
        className={styles.price}
      />
      <MyButton onClick={submit}>{t.searchProperty}</MyButton>
    </div>
  );
};

export default PropertySearchBar;
