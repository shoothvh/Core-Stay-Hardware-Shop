using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvaliacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AvaliacoesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Avaliacoes/produto/5
        [HttpGet("produto/{produtoId}")]
        public async Task<ActionResult<IEnumerable<Avaliacao>>> GetReviewsByProduct(int produtoId)
        {
            var reviews = await _context.Avaliacoes
                .Where(a => a.ProdutoId == produtoId)
                .OrderByDescending(a => a.Data)
                .ToListAsync();

            return reviews;
        }

        // POST: api/Avaliacoes
        [HttpPost]
        public async Task<ActionResult<Avaliacao>> PostReview(Avaliacao avaliacao)
        {
            // Verify if product exists
            var produto = await _context.Produtos.FindAsync(avaliacao.ProdutoId);
            if (produto == null)
            {
                return NotFound("Produto não encontrado.");
            }
            
            _context.Avaliacoes.Add(avaliacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReviewsByProduct", new { produtoId = avaliacao.ProdutoId }, avaliacao);
        }
    }
}
