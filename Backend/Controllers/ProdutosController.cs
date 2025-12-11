using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    // Simulação de Banco de Dados em Memória (Static)
    private static readonly List<Produto> _produtos = new()
    {
        new Produto 
        { 
            Id = 1, 
            Nome = "AMD Ryzen 5 5600X", 
            Preco = 1200.00m, 
            Categoria = "Processador",
            ImagemUrl = "/images/ryzen5.png",
            Descricao = "6 Núcleos | 12 Threads | 3.7GHz Base | 4.6GHz Turbo | Cache 35MB | Socket AM4 | TDP 65W",
            Estoque = 25
        },
        new Produto 
        { 
            Id = 2, 
            Nome = "NVIDIA GTX 1650 4GB", 
            Preco = 950.00m, 
            Categoria = "Placa de Vídeo",
            ImagemUrl = "/images/gtx1650.png",
            Descricao = "4GB GDDR6 | 128-bit | 1485MHz Base | 1620MHz Boost | 896 CUDA Cores | PCIe 3.0",
            Estoque = 8
        },
        new Produto 
        { 
            Id = 3, 
            Nome = "Mouse Gamer RGB", 
            Preco = 150.00m, 
            Categoria = "Periféricos",
            ImagemUrl = "/images/mouse.png",
            Descricao = "Sensor Óptico 10.000 DPI | 7 Botões Programáveis | RGB Chroma | Polling Rate 1000Hz | Peso: 95g",
            Estoque = 42
        },
        new Produto 
        { 
            Id = 4, 
            Nome = "Teclado Mecânico Gamer", 
            Preco = 320.00m, 
            Categoria = "Periféricos",
            ImagemUrl = "/images/teclado.png",
            Descricao = "Switch Outemu Brown | Layout TKL (87 Teclas) | RGB por Tecla | Anti-Ghosting | Cabo USB-C Removível",
            Estoque = 18
        },
        new Produto 
        { 
            Id = 5, 
            Nome = "Intel Core i5-12400F", 
            Preco = 1050.00m, 
            Categoria = "Processador",
            ImagemUrl = "/images/inteli5.png",
            Descricao = "6 Núcleos | 12 Threads | 2.5GHz Base | 4.4GHz Turbo | Cache 18MB | Socket LGA 1700 | TDP 65W",
            Estoque = 12
        },
        new Produto 
        { 
            Id = 6, 
            Nome = "RTX 4060 8GB", 
            Preco = 2200.00m, 
            Categoria = "Placa de Vídeo",
            ImagemUrl = "/images/rtx4060.png",
            Descricao = "8GB GDDR6 | 128-bit | 1830MHz Base | 2460MHz Boost | 3072 CUDA Cores | DLSS 3 | Ray Tracing",
            Estoque = 5
        },
        new Produto 
        { 
            Id = 7, 
            Nome = "Memória RAM 16GB DDR4", 
            Preco = 280.00m, 
            Categoria = "Memória",
            ImagemUrl = "/images/ram.png",
            Descricao = "16GB (1x16GB) | DDR4-3200MHz | CL16 | Latência 16-20-20 | Tensão 1.35V | Heatsink Alumínio",
            Estoque = 35
        },
        new Produto 
        { 
            Id = 8, 
            Nome = "SSD NVMe 1TB", 
            Preco = 450.00m, 
            Categoria = "Armazenamento",
            ImagemUrl = "/images/ssd.png",
            Descricao = "1TB | NVMe M.2 2280 | Leitura 3500MB/s | Gravação 2100MB/s | PCIe Gen 3.0 x4 | TLC NAND",
            Estoque = 22
        },
        new Produto 
        { 
            Id = 9, 
            Nome = "Fonte 650W 80 Plus Bronze", 
            Preco = 380.00m, 
            Categoria = "Fonte",
            ImagemUrl = "/images/fonte.png",
            Descricao = "650W Reais | 80 Plus Bronze | PFC Ativo | Eficiência 85% | Fan 120mm | Cabos Flat",
            Estoque = 15
        },
        new Produto 
        { 
            Id = 10, 
            Nome = "Headset Gamer 7.1 Surround", 
            Preco = 250.00m, 
            Categoria = "Periféricos",
            ImagemUrl = "/images/headset.png",
            Descricao = "Driver 53mm | Som Surround 7.1 Virtual | Microfone Removível | RGB | USB | Memory Foam",
            Estoque = 28
        }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Produto>> Get()
    {
        return Ok(_produtos);
    }

    [HttpPost]
    public ActionResult<Produto> Cadastrar([FromBody] Produto produto)
    {
        // Gera novo ID incrementando o último. Se lista vazia, começa com 1.
        int novoId = _produtos.Any() ? _produtos.Max(p => p.Id) + 1 : 1;
        produto.Id = novoId;

        _produtos.Add(produto);

        // Retorna 201 Created com o objeto criado
        return CreatedAtAction(nameof(Get), new { id = produto.Id }, produto);
    }

    [HttpDelete("{id}")]
    public IActionResult Deletar(int id)
    {
        var produto = _produtos.FirstOrDefault(p => p.Id == id);
        
        if (produto == null)
            return NotFound();

        _produtos.Remove(produto);

        return NoContent();
    }
}
