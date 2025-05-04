import React, { FC, ReactNode } from 'react'
import NavBar from '../NavBar/NavBar'
import styles from './AppLayout.module.css'
import Header from '../Header/Header'
interface Props {
  children: ReactNode
}
const AppLayout: FC<Props> = ({ children }) => {
  return (
    <div className={styles.page}>

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
