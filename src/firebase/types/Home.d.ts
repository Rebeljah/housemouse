import { InviteId } from './Invite'

export type HomeId = string
export type UserId = string
export type ChoreId = string


export interface Home {
    name: string
    members: UserId[]
    chores: ChoreId[]
    inviteCode: InviteId
}