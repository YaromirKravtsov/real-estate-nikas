import React, { ChangeEvent, FC, useState } from 'react';
import styles from './SearchBar.module.css'
import MyInput from '../../../../UI/MyInput/MyInput';
import MyButton from '../../../../UI/MyButton/MyButton';
interface Props {
    handleSearch: (val: string) => void;

}
const SearchBar: FC<Props> = ({ handleSearch }) => {
  const [searchBar, setSearchBar] = useState<string>('');

  const onChange = (value: string) => {
    setSearchBar(value);
  };

  const onSearch = () => {
    handleSearch(searchBar.trim());
  };

  return (
    <div className={styles.main}>
      <MyInput
        value={searchBar}
        setValue={onChange}
        placeholder="Введіть для пошуку..."
        className={styles.input}
        onEnter={onSearch}
      />
      <MyButton onClick={onSearch} disabled={!searchBar.trim()}>
        Пошук
      </MyButton>
    </div>
  );
};

export default SearchBar;
