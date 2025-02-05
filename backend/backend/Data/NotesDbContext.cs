using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class NotesDbContext(DbContextOptions<NotesDbContext> options) : DbContext(options)
    {
        public DbSet<Notes> Notes { get; set; } = null!;
    }
}