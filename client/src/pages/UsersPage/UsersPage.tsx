import React, { useEffect, useState } from 'react'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import styles from './UsersPage.module.css'
import SearchBar from './components/SearchBar/SearchBar'
import $api from '../../app/api/http'
import { IUser } from '../../models/IUser'
import UsersList from './components/UsersList/UsersList'
import { useNavigate } from 'react-router-dom'
import { RouteNames } from '../../app/router'
import { useTranslations } from '../../store/translations';

const UsersPage = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const navigate = useNavigate()
    const handleAction = () => {
        navigate(RouteNames.USER)
    }
    const handleSearch = async (val:string) => {
        const {data} = await $api.get('/users?searchQuery='+val);
        setUsers(data)
    }
    const { translations } = useTranslations();
    const t = translations();

    useEffect(()=>{
        handleSearch('')
    },[])
  return (
    <PageLayout pageTitle = {t.employees} actionTitle = {t.createEmployee}
     action = {handleAction}  >
        <div className={styles.main}>
            <SearchBar handleSearch = {handleSearch} />
            <UsersList users={users}/>
        </div>
    </PageLayout>
  )
}

export default UsersPage
