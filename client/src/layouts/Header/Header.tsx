import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

type HeaderProps = {
  textColor?: string;
};

const Header: React.FC<HeaderProps> = ({ textColor = "#000" }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/search");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} style={{ color: textColor }}>
        Nikas
      </div>

      <nav className={styles.nav}>
        {['Оренда', 'Купівля', 'Продаж', 'Зв’язатися з нами'].map((item) => (
          <button
            key={item}
            onClick={handleNavigate}
            className={styles.navItem}
            style={{ color: textColor, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {item}
          </button>
        ))}
      </nav>

      <button className={styles.button} onClick={handleNavigate}>
        Переглянути оголошення
        <span style={{ fontSize: '1.125rem' }}>→</span>
      </button>
    </header>
  );
};

export default Header;
