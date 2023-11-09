import { auth } from '../firebase/instances'
import { reactive } from 'vue'
import { getUserData } from '../firebase/firestore'

import type { CurrentUser } from './types/User'
import type { CurrentHome } from './types/Home'

const currentUser = reactive({
    id: '', name: '', homeId: '', isSet: false
} as CurrentUser)
export const useCurrentUser = () => {
    return {
        currentUser,
        unsetCurrentUser: () => {
            currentUser.id = ''
            currentUser.homeId = ''
            currentUser.isSet = false
        },
        setCurrentUser: (user: CurrentUser) => {
            currentUser.id = user.id
            currentUser.homeId = user.homeId
            currentUser.isSet = true
        },
    }
}

const currentHome = reactive({
    id: '', name: '', members: [], chores: [], inviteCode: '', isSet: false,
} as CurrentHome)
export const useCurrentHome = () => {
    return {
        currentHome,
        unsetCurrentHome: () => {
            currentHome.id = ''
            currentHome.name = ''
            currentHome.members = []
            currentHome.chores = []
            currentHome.inviteCode = ''
            currentHome.isSet = false
        },
        setCurrentHome: (home: CurrentHome) => {
            currentHome.id = home.id
            currentHome.name = home.name
            currentHome.members = home.members
            currentHome.chores = home.chores
            currentHome.inviteCode = home.inviteCode
            currentHome.isSet = true
        },
    }
}


// update the current user upon login/logout
auth.onAuthStateChanged( async (authUser) => {
    const { unsetCurrentUser, setCurrentUser } = useCurrentUser()

    if (authUser !== null) {
        const userData = await getUserData(authUser.uid)
        setCurrentUser({id: authUser.uid, homeId: '', isSet: true})
    } else {
      unsetCurrentUser()
    }
})
