namespace TaskAppApi.DTOs
{
    public class UserTaskDTO
    {
        public string Title { get; set; }  // User provides this
        public string Description { get; set; }  // User provides this
        public DateTime DueDate { get; set; }  // User provides this
        public string Category { get; set; }  // User provides this
    }
}
