import React, { FC, ReactNode } from 'react'
import NavBar from '../NavBar/NavBar'
import styles from './AppLayout.module.css'
import AdminHeader from '../AdminHeader/AdminHeader'
import { useAuthStore } from '../../app/store/auth'
import { useLocation } from 'react-router-dom'
import { adminRoutes } from '../../app/router'
import { useIsAdminPage } from '../../hooks/useIsInRoutes'
import Header from '../Header/Header'
interface Props {
  children: ReactNode
}
const AppLayout: FC<Props> = ({ children }) => {
  // показуємо AdminHeader, якщо роль – admin або поточний шлях – в переліку adminRoutes
  const showAdminHeader = useIsAdminPage()

  return (
    <div className={`${styles.page} ${showAdminHeader && styles.admin}`}>
      {showAdminHeader ?<AdminHeader /> : <Header/>}
      <div className={styles.pageRow}>
        {showAdminHeader && <NavBar className={styles.navBar} />}
        <div className={styles.main}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AppLayout
