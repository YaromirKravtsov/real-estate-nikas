import React from 'react';
import styles from '../PropertiesPage.module.css';

import ListIteam from '../../../UI/ListIteam/ListIteam';
import { IProperty } from '../../../models/IProperty';
import { RouteNames } from '../../../app/router';
import { useTranslations } from '../../../store/translations';

interface Props {
  properties: IProperty[];
}

const PropertiesList: React.FC<Props> = ({ properties }) => {
  const { translations } = useTranslations();
  const t = translations();

  return (
    <div className={styles.list}>
      {properties.map(p => (
        <ListIteam key={p.id} link={`${RouteNames.PROPERTY}/${p.id}`}>
          <h3>{p.title}</h3>
          <p>{p.city}, {p.address}</p>
          <p>
            {p.listingType === 'sale' ? t.sale : t.rent} • {t[p.propertyType] || p.propertyType}
          </p>
          <p>{p.price} €</p>
        </ListIteam>
      ))}
    </div>
  );
};

export default PropertiesList;
