using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Avaliacao
    {
        public int Id { get; set; }

        public int ProdutoId { get; set; }
        
        [JsonIgnore] // Avoid cycle
        public Produto? Produto { get; set; }

        [Required]
        public string UsuarioNome { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Estrelas { get; set; }

        public string Comentario { get; set; } = string.Empty;

        public DateTime Data { get; set; } = DateTime.Now;
    }
}
