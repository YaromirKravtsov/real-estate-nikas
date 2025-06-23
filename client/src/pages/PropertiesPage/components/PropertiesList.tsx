import React from 'react';
import styles from '../PropertiesPage.module.css';

import ListIteam from '../../../UI/ListIteam/ListIteam';
import { IProperty } from '../../../models/IProperty';
import { RouteNames } from '../../../app/router';

interface Props {
  properties: IProperty[];
}

const PropertiesList: React.FC<Props> = ({ properties }) => (
  <div className={styles.list}>
    {properties.map(p => (
      <ListIteam key={p.id} link={`${RouteNames.PROPERTY}/${p.id}`}>
        <h3>{p.title}</h3>
        <p>{p.city}, {p.address}</p>
        <p>{p.listingType === 'sale' ? 'Продаж' : 'Оренда'} • {p.propertyType}</p>
        <p>₴{p.price}</p>
      </ListIteam>
    ))}
  </div>
);

export default PropertiesList;
