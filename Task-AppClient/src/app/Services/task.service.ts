import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../Environments/environment';
import { AuthService } from './auth.service';
import { UserTask } from '../Models/UserTask';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = `${environment.apiUrl}/api/Tasks`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders() {
    const token = this.authService.getToken();
    console.log('Token:', token);  // This helps you check if token is present in console
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
  

  getTasks(): Observable<UserTask[]> {
    return this.http.get<UserTask[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getTaskById(id: number): Observable<UserTask> {
    return this.http.get<UserTask>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTask(task: UserTask): Observable<UserTask> {
    if (task.id) {
      throw new Error('Task id is missing');
    }
    return this.http.post<UserTask>(this.apiUrl, task, { headers: this.getHeaders() });
  }
  
  updateTask(task: UserTask): Observable<UserTask> {
    if (!task.id) {
      throw new Error('Task id is missing');
    }
    return this.http.put<UserTask>(`${this.apiUrl}/${task.id}`, task, { headers: this.getHeaders() });
  }

  updateTaskCompletion(id: number, isCompleted: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, isCompleted, { headers: this.getHeaders() });
  }
  
  
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

}
