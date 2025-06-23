import React from 'react';
import styles from '../PropertiesPage.module.css';

import MyButton from '../../../UI/MyButton/MyButton';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const prev = () => onPageChange(Math.max(1, currentPage - 1));
  const next = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className={styles.pagination}>
      <MyButton onClick={prev} disabled={currentPage <= 1}>←</MyButton>
      <span>{currentPage} / {totalPages}</span>
      <MyButton onClick={next} disabled={currentPage >= totalPages}>→</MyButton>
    </div>
  );
};

export default Pagination;
