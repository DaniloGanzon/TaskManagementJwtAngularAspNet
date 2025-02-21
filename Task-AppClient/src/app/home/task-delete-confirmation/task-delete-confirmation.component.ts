import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../Services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-delete-confirmation',
  imports: [ CommonModule],
  templateUrl: './task-delete-confirmation.component.html',
  styleUrls: ['./task-delete-confirmation.component.css']
})
export class TaskDeleteConfirmationComponent implements OnInit {
  taskId: number | null = null;
  errorMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the taskId from the route
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
  }

  // Delete task method
  deleteTask(): void {
    if (this.taskId) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          // Navigate back to task list after successful deletion
          this.router.navigate(['/home/list']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = `Error deleting task (${err.status})`;
        }
      });
    }
  }

  // Cancel deletion and go back to the task list
  cancel(): void {
    this.router.navigate(['/home/list']);
  }
}
