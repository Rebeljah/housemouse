import { Timestamp } from "firebase/firestore"

export type { FirebaseData, Chore, Home, User }


type HomeId = string
type UserId = string
type ChoreId = string
type Days = number
type InviteId = string


interface Chore {
    name: string
    assignee: UserId
    frequency: Days
    dueDate: Timestamp
    completions: number
    requiredCompletions: number
}


interface Home {
    name: string
    members: UserId[]
    chores: ChoreId[]
    inviteCode: InviteId
}


interface Invite {
    homeId: HomeId
}


interface User {
    name: string
    homeId: string
    isHomeAdmin: string
}