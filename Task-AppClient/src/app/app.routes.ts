import { Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { TaskListsComponent } from './home/task-lists/task-lists.component';
import { TaskFormComponent } from './home/task-form/task-form.component';
import { AuthGuard } from './Services/AuthGuard';
import { AuthGuardLoggedOut } from './Services/AuthGuardLoggedOut';
import { CompleteTaskComponent } from './home/complete-task/complete-task.component';
import { UserComponent } from './user/user.component';
import { TaskDeleteConfirmationComponent } from './home/task-delete-confirmation/task-delete-confirmation.component';




export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'signup', component: RegisterComponent, canActivate: [AuthGuardLoggedOut] },
      { path: 'signin', component: LoginComponent, canActivate: [AuthGuardLoggedOut] }
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],  // Protect the home route
    children: [
      { path: '', component: TaskListsComponent },  // Default child route for /home
      { path: 'list', component: TaskListsComponent },  // Explicit route for task list
      { path: 'tasks/:id/edit', component: TaskFormComponent },  // Edit task
      { path: 'new', component: TaskFormComponent },  // Add new task
      { path: 'tasks/:id/delete', component: TaskDeleteConfirmationComponent },  // Delete task
      { path: 'tasks/:id/complete', component: CompleteTaskComponent },  // Complete task
    ]
  },
  { path: '**', redirectTo: '' }
];
