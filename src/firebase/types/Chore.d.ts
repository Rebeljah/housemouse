type UserId = string
type Days = number

interface Chore {
    name: string
    assignee: UserId
    frequency: Days
    dueDate: Timestamp
    completions: number
    requiredCompletions: number
}

export { Chore }