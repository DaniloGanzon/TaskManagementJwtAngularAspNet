using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskAppApi.Data;
using TaskAppApi.DTOs;
using TaskAppApi.Models;
using TaskAppApi.Services;

namespace TaskAppApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly UserTaskService _taskService;

        public TasksController(UserTaskService taskService)
        {
            _taskService = taskService;
        }

        // Create a new task
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] UserTaskDTO taskDTO)
        {
            if (taskDTO == null)
            {
                return BadRequest("Task data is invalid.");
            }

            // Validation: Ensure that required fields are not null or empty
            if (string.IsNullOrEmpty(taskDTO.Title) || string.IsNullOrEmpty(taskDTO.Description) || string.IsNullOrEmpty(taskDTO.Category))
            {
                return BadRequest("Title, Description, and Category are required fields.");
            }

            if (taskDTO.DueDate <= DateTime.Now)
            {
                return BadRequest("Due date must be a future date.");
            }

            var task = new UserTask
            {
                Title = taskDTO.Title,
                Description = taskDTO.Description,
                DueDate = taskDTO.DueDate,
                Category = taskDTO.Category,
                // CreationDate and IsCompleted are set by default in the model, no need to pass them in DTO
            };
            try
            {
                await _taskService.AddAsync(task);
                return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the task", Error = ex.Message });
            }
        }

        // Update task (e.g., Title, Description, DueDate, etc.)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UserTaskDTO taskDTO)
        {
            if (taskDTO == null)
            {
                return BadRequest("Task data is invalid.");
            }

            // Validation: Ensure that required fields are not null or empty
            if (string.IsNullOrEmpty(taskDTO.Title) || string.IsNullOrEmpty(taskDTO.Description) || string.IsNullOrEmpty(taskDTO.Category))
            {
                return BadRequest("Title, Description, and Category are required fields.");
            }

            if (taskDTO.DueDate <= DateTime.Now)
            {
                return BadRequest("Due date must be a future date.");
            }

            var task = await _taskService.GetByIdAsync(id);
            if (task == null)
            {
                return NotFound(new { Message = "Task not found" });
            }

            // Update the task properties
            task.Title = taskDTO.Title;
            task.Description = taskDTO.Description;
            task.DueDate = taskDTO.DueDate;
            task.Category = taskDTO.Category;

            try
            {
                await _taskService.UpdateAsync(task);
                return Ok(new { Message = "Task updated successfully", Task = task });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the task", Error = ex.Message });
            }
        }

        // Update task completion status
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> UpdateTaskCompletion(int id, [FromBody] bool isCompleted)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null)
            {
                return NotFound(new { Message = "Task not found" });
            }

            try
            {
                await _taskService.UpdateIsCompletedAsync(id, isCompleted);
                return Ok(new { Message = "Task completion status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the task", Error = ex.Message });
            }
        }

        // Get all tasks for the current user
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _taskService.GetAllAsync();
            return Ok(tasks);
        }

        // Get task by ID for the current user
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null)
            {
                return NotFound(new { Message = "Task not found" });
            }
            return Ok(task);
        }

        // Delete task by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null)
            {
                return NotFound(new { Message = "Task not found" });
            }
            try
            {
                await _taskService.DeleteAsync(id);
                return Ok(new { Message = "Task deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting the task", Error = ex.Message });
            }
        }
    }
}
