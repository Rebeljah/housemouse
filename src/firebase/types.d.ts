import { Timestamp } from "firebase/firestore"

export type { Chore, Home, User, FirestoreType }


type HomeId = string
type UserId = string
type ChoreId = string
type Days = number
type InviteId = string
type FirestoreType = Chore | Home | Invite | User;


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