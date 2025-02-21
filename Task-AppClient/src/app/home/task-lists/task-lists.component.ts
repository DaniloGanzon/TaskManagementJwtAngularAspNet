import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { UserTask } from '../../Models/UserTask';
import { Category, categoryColors, defaultCategoryColor, defaultTextColor, textColors } from '../../Models/Category';
import { CommonModule, DatePipe } from '@angular/common';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTextDirective, ColComponent, RowComponent, TextColorDirective } from '@coreui/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-lists',
  imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent,
    TextColorDirective,
    CommonModule],
  providers: [DatePipe],
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.css']
})
export class TaskListsComponent implements OnInit {
  userTasks: UserTask[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserTasks();
  }

  loadUserTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.userTasks = tasks;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  // Get a random gradient color for the card header
  getRandomHeaderColor(): string {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  getStatus(task: UserTask): string {
    if (task.isCompleted) {
      return 'Completed';
    }
  
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    if (dueDate < now) {
      return 'Overdue';
    } else if (this.isCritical(task)) {
      return 'Due Soon';
    } else {
      return 'Pending';
    }
  }
  
  isCritical(task: UserTask): boolean {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    return timeDiff <= oneDayInMillis && !task.isCompleted;
  }
  

// Get the status class based on the task status for dynamic text color
getStatusClass(task: UserTask): string {
  if (task.isCompleted) {
    return 'text-success'; // Green for completed
  } else if (this.getStatus(task) === 'Overdue') {
    return 'text-danger'; // Red for overdue
  } else if (this.getStatus(task) === 'Due Soon') {
    return 'text-warning'; // Yellow for due soon
  } else {
    return 'text-white'; // White for pending
  }
}


// In task-lists.component.ts
completeTask(task: UserTask): void {
  this.router.navigate([`/home/tasks/${task.id}/complete`]);
}


  // Navigate to delete confirmation page when the delete button is clicked
  confirmDelete(task: UserTask): void {
    this.router.navigate([`/home/tasks/${task.id}/delete`]);
  }


  // Edit task
  editTask(task: UserTask): void {
    console.log('Edit task:', task);
    this.router.navigate([`/home/tasks/${task.id}/edit`]); // Navigate to the edit page with the task ID
  }
  
}
