import React, { FC } from 'react'
import styles from './UsersList.module.css'
import ListIteam from '../../../../UI/ListIteam/ListIteam'
import { IUser } from '../../../../models/IUser'
import { RouteNames } from '../../../../app/router'
interface Props {
    users: IUser[]
}
const UsersList: FC<Props> = ({ users }) => {

    return (
        <div className={styles.main}>
            {users.map(user =>
                <ListIteam link={RouteNames.USER + '/' + user.id}>
                    <p>{user.firstName} {user.lastName}</p>
                </ListIteam>
            )}
        </div>
    )
}

export default UsersList
