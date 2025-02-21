import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../Services/task.service';
import { UserTask } from '../../Models/UserTask';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  today: Date = new Date();
  taskForm: FormGroup;
  task: UserTask = {
    title: '',
    description: '',
    dueDate: new Date(),
    category: ''
  };
  isEditing: boolean = false;
  taskId: number | null = null;
  errorMessage: string = "";

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      dueDate: ['', [Validators.required, this.dateValidator.bind(this)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.taskId = Number(paramMap.get('id'));
      if (this.taskId) {
        this.isEditing = true;
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          category: task.category
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = `Error loading task (${err.status})`;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formData: UserTask = this.taskForm.value;
      formData.isCompleted = false;  // Default value, user cannot change this
      formData.dateCreation = new Date().toISOString();  // Backend will handle this field
  
      if (this.isEditing) {
        if (this.taskId) {
          formData.id = this.taskId;  // Only add ID if editing an existing task
          this.taskService.updateTask(formData).subscribe({
            next: () => {
              this.router.navigate(['/home/list']);
            },
            error: (err) => {
              console.error(err);
              this.errorMessage = `Error updating task (${err.status})`;
            }
          });
        }
      } else {
        // Create new task without the task.id
        this.taskService.createTask(formData).subscribe({
          next: () => {
            this.router.navigate(['/home/list']);
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = `Error creating task (${err.status})`;
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
  

  onCancel(): void {
    this.taskForm.reset();
    this.router.navigate(['/tasks']);
  }

  // Custom validator to prevent selecting a future date
  dateValidator(control: any) {
    if (control.value && control.value > this.today) {
      return { invalidDate: true };
    }
    return null;
  }

  // Triggered when the date changes
  onDateChange(): void {
    if (this.taskForm.get('dueDate')?.invalid) {
      this.errorMessage = 'The due date cannot be later than today.';
    } else {
      this.errorMessage = '';  // Clear error when valid
    }
  }

}
