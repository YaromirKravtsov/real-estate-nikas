import React, { FC, ReactNode } from 'react'
import NavBar from '../NavBar/NavBar'
import styles from './AppLayout.module.css'
import AdminHeader from '../AdminHeader/AdminHeader'
import { useAuthStore } from '../../app/store/auth'
interface Props {
  children: ReactNode
}
const AppLayout: FC<Props> = ({ children }) => {
  const {role} = useAuthStore()
  return (
    <div className={styles.page}>
      
      {role == 'admin' && <AdminHeader/> }
      <div className={styles.pageRow}>
        <NavBar className ={styles.navBar}/>
        <div className={styles.main}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AppLayout
