import { Timestamp } from 'firebase/firestore';

type HomeId = string;
type UserId = string;

// Base interface for document types
interface Document {}

// Subcollection type for referencing subcollections within a document
interface SubCollection<T extends Document> {
    documents: { [documentId: string]: T };
}

// User document schema
interface User extends Document {
    uid: UserId;               // User's unique ID
    email: string;             // User's email
    joinedDate: Timestamp;    // Timestamp of user's registration date
    lastOnline: Timestamp;    // Timestamp of the user's last online activity
    isOnline: boolean;        // Online status
    homes: HomeId[];          // IDs of homes associated with the user
}

// Enum to represent user roles within a home
enum UserHomeRole {
    Owner = 'o',   // Owner of the home
    Member = 'm',  // Member of the home
}

// User data stored in a Home document
interface HomeUser extends Document {
    uid: UserId;                  // User's unique ID
    roles: UserHomeRole[];        // User's roles in the home (Owner or Member)
    taskQueueTime: Timestamp;    // When the user entered the task queue
}

// Chore document schema stored in a Home
interface HomeChore extends Document {
    title: string;                // Chore title
    description: string;          // Chore description
    assigneeUid: UserId;          // User ID of the chore assignee
    frequencyDays: number         // How long after the completion date to reschedule
    dueDate: Timestamp;           // Due date for the chore
    completionsRequired: number;  // Number of completions required for the chore
    completionsDone: number;      // Number of completions completed for the chore
}

// Home document schema
interface Home extends Document {
    uid: HomeId;               // Home's unique ID
    users: SubCollection<HomeUser>;  // Subcollection of users in the home
    chores: SubCollection<HomeChore>;  // Subcollection of chores in the home
}
