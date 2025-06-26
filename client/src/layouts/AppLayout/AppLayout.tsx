import React, { FC, ReactNode } from 'react'
import NavBar from '../NavBar/NavBar'
import styles from './AppLayout.module.css'
import AdminHeader from '../AdminHeader/AdminHeader'
import { useAuthStore } from '../../app/store/auth'
import { useLocation } from 'react-router-dom'
import { adminRoutes } from '../../app/router'
import { useIsAdminPage } from '../../hooks/useIsInRoutes'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
interface Props {
  children: ReactNode
}
const AppLayout: FC<Props> = ({ children }) => {
  const location = useLocation();

  const showAdminHeader = useIsAdminPage();

  const isHomePage = location.pathname === '/';

  return (
    <div className={`${styles.page} ${showAdminHeader && styles.admin}`}>
      {showAdminHeader
        ? <AdminHeader />
        : <Header textColor={isHomePage ? '#fff' : undefined} />
      }
      <div className={styles.pageRow}>
        {showAdminHeader && <NavBar className={styles.navBar} />}
        <div className={styles.main}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout
