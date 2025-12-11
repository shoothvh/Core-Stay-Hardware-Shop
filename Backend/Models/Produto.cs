namespace Backend.Models;

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string Categoria { get; set; } = string.Empty;
    public string ImagemUrl { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public int Estoque { get; set; } = 50; // Default stock
}
