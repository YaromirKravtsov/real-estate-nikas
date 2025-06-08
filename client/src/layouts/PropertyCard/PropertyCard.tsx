import React from 'react';
import styles from './PropertyCard.module.scss';

interface PropertyCardProps {
  imageUrl: string;
  title: string;
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  title,
  price,
  address,
  bedrooms,
  bathrooms,
  area,
}) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>${Number(price).toLocaleString()}/month</p>
        <p className={styles.address}>{address}</p>
        <div className={styles.details}>
          <span>🛏 {bedrooms} Beds</span>
          <span>🛁 {bathrooms} Bathrooms</span>
          {area && <span>📐 {area}</span>}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
