export interface UserTask {
    id?: number;
    title: string;
    description: string;
    dueDate: Date;
    isCompleted?: boolean;
    category: string;
    dateCreation?: string;
  }
  