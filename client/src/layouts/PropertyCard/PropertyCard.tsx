import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PropertyCard.module.scss';
import { RouteNames } from '../../app/router';
import { useTranslations } from '../../store/translations';

const backendUrl = 'http://localhost:5001/static/';

interface PropertyCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  listingType: 'rent' | 'sale';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  imageUrl,
  title,
  price,
  address,
  bedrooms,
  bathrooms,
  listingType,
}) => {
  const navigate = useNavigate();
  const t = useTranslations().translations();

  const getImageSrc = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${backendUrl}${url}`;
  };

  const handleClick = () => {
    navigate(`${RouteNames.PROPERTY_DETEIL}/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={getImageSrc(imageUrl)} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>
          ${Number(price).toLocaleString()}
          {listingType === 'rent' ? ` / ${t.month || 'month'}` : ''}
        </p>
        <p className={styles.address}>{address}</p>
        <div className={styles.details}>
          <span>🛏 {bedrooms} {t.beds || 'Beds'}</span>
          <span>🛁 {bathrooms} {t.baths || 'Bathrooms'}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
