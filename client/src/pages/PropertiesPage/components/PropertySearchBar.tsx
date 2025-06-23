import React, { useState } from 'react';
import styles from '../PropertiesPage.module.css';
import { SearchPropertyDto } from '../../../models/IProperty';
import MyInput from '../../../UI/MyInput/MyInput';
import MyButton from '../../../UI/MyButton/MyButton';
import MySelect from '../../../UI/MySelect/MySelect';
interface Props {
  filters: SearchPropertyDto;
  onSearch: (newFilters: Partial<SearchPropertyDto>) => void;
}

const listingOptions = [
  { value: 'sale', label: 'Продаж' },
  { value: 'rent', label: 'Оренда' },
];

const PropertySearchBar: React.FC<Props> = ({ filters, onSearch }) => {
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
        placeholder="Тип оголошення"
        options={listingOptions}
        value={local.listingType}
        onChange={v => handleChange('listingType', v)}
      />
      <MyInput
        placeholder="Ціна від"
        value={local.priceFrom?.toString() || ''}
        setValue={v => handleChange('priceFrom', Number(v) || undefined)}
        type="number"
        className={styles.price}
      />
      <MyInput
        placeholder="Ціна до"
        value={local.priceTo?.toString() || ''}
        setValue={v => handleChange('priceTo', Number(v) || undefined)}
        type="number"
        className={styles.price}

      />
      <MyButton onClick={submit}>Пошук</MyButton>
    </div>
  );
};

export default PropertySearchBar;
