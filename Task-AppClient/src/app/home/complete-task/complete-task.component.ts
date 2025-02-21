import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTask } from '../../Models/UserTask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complete-task',
  imports: [CommonModule],
  templateUrl: './complete-task.component.html',
  styleUrl: './complete-task.component.css'
})
export class CompleteTaskComponent implements OnInit {
  taskId: number | null = null;
  task: UserTask | undefined;
  errorMessage: string = '';
  
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get taskId from route parameters
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.taskId) {
      this.loadTask(this.taskId);  // Load the task if taskId is available
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Error loading task (${err.status})`;
      }
    });
  }

  completeTask(): void {
    if (this.task?.id) {  // Use optional chaining to safely access task.id
      // Set task as completed
      this.task.isCompleted = true;
  
      // Call the TaskService to update completion status
      this.taskService.updateTaskCompletion(this.task.id, this.task.isCompleted).subscribe({
        next: () => {
          // On success, navigate back to the task list
          this.router.navigate(['/home/list']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = `Error completing task (${err.status})`;
        }
      });
    } else {
      this.errorMessage = 'Task data is missing.';
    }
  }
  

  cancel(): void {
    // Navigate back to task list without completing the task
    this.router.navigate(['/home/list']);
  }
}
