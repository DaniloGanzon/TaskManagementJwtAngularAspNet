using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskAppApi.Data;
using TaskAppApi.Models;
using TaskAppApi.Repositories;

namespace TaskAppApi.Services
{
    public class UserTaskService : IRepository<UserTask>
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserTaskService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task AddAsync(UserTask userTask)
        {
            userTask.UserId = GetCurrentUserId();
            await _context.UserTask.AddAsync(userTask);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var taskInDb = await _context.UserTask.FindAsync(id);
            if (taskInDb != null)
            {
                _context.UserTask.Remove(taskInDb);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserTask>> GetAllAsync()
        {
            var userId = GetCurrentUserId();
            return await _context.UserTask.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<UserTask?> GetByIdAsync(int id)
        {
            var userId = GetCurrentUserId();
            return await _context.UserTask
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task UpdateAsync(UserTask userTask)
        {
            var userId = GetCurrentUserId();
            if (userTask.UserId == userId)
            {
                _context.UserTask.Update(userTask);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateIsCompletedAsync(int taskId, bool isCompleted)
        {
            var taskInDb = await _context.UserTask
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == GetCurrentUserId());

            if (taskInDb != null)
            {
                taskInDb.IsCompleted = isCompleted;
                _context.UserTask.Update(taskInDb);
                await _context.SaveChangesAsync();
            }
        }

        private string GetCurrentUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            return userId;
        }

    }

}

