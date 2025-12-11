using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Produto> Produtos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial products
            modelBuilder.Entity<Produto>().HasData(
                // Processadores
                new Produto { Id = 1, Nome = "AMD Ryzen 5 5600X", Categoria = "Processador", Preco = 1299.00m, ImagemUrl = "/images/ryzen5.png", Descricao = "6 Cores | 12 Threads | 3.7GHz Base | 4.6GHz Boost | 32MB Cache | AM4", Estoque = 25 },
                new Produto { Id = 5, Nome = "Intel Core i5-12400F", Categoria = "Processador", Preco = 1099.00m, ImagemUrl = "/images/inteli5.png", Descricao = "6 Cores | 12 Threads | 2.5GHz Base | 4.4GHz Boost | LGA 1700 | 65W TDP", Estoque = 18 },
                new Produto { Id = 11, Nome = "AMD Ryzen 7 5800X", Categoria = "Processador", Preco = 1899.00m, ImagemUrl = "/images/ryzen7.png", Descricao = "8 Cores | 16 Threads | 3.8GHz Base | 4.7GHz Boost | 36MB Cache | AM4", Estoque = 12 },
                new Produto { Id = 12, Nome = "Intel Core i7-13700K", Categoria = "Processador", Preco = 2599.00m, ImagemUrl = "/images/inteli7.png", Descricao = "16 Cores | 24 Threads | 3.4GHz Base | 5.4GHz Boost | LGA 1700", Estoque = 8 },
                
                // Placas de Vídeo
                new Produto { Id = 2, Nome = "NVIDIA RTX 4060 8GB", Categoria = "Placa de Vídeo", Preco = 2499.00m, ImagemUrl = "/images/rtx4060.png", Descricao = "8GB GDDR6 | 128-bit | Ray Tracing | DLSS 3.0 | PCIe 4.0", Estoque = 15 },
                new Produto { Id = 6, Nome = "GTX 1650 4GB OC", Categoria = "Placa de Vídeo", Preco = 1299.00m, ImagemUrl = "/images/gtx1650.png", Descricao = "4GB GDDR6 | 128-bit | 1590MHz Boost | DirectX 12 | HDMI + DP", Estoque = 8 },
                new Produto { Id = 13, Nome = "NVIDIA RTX 4070 12GB", Categoria = "Placa de Vídeo", Preco = 3999.00m, ImagemUrl = "/images/rtx4070.png", Descricao = "12GB GDDR6X | 192-bit | Ray Tracing | DLSS 3.0 | PCIe 4.0", Estoque = 6 },
                new Produto { Id = 14, Nome = "AMD RX 7600 8GB", Categoria = "Placa de Vídeo", Preco = 2199.00m, ImagemUrl = "/images/rx7600.png", Descricao = "8GB GDDR6 | 128-bit | RDNA 3 | FSR 3.0 | PCIe 4.0", Estoque = 10 },
                
                // Memória RAM
                new Produto { Id = 3, Nome = "Kingston Fury 16GB DDR4", Categoria = "Memória RAM", Preco = 349.00m, ImagemUrl = "/images/ram.png", Descricao = "16GB (2x8GB) | DDR4-3200 | CL16 | XMP 2.0 | Dissipador Alumínio", Estoque = 42 },
                new Produto { Id = 15, Nome = "Corsair Vengeance 32GB DDR5", Categoria = "Memória RAM", Preco = 799.00m, ImagemUrl = "/images/ram32.png", Descricao = "32GB (2x16GB) | DDR5-5600 | CL36 | XMP 3.0 | RGB", Estoque = 15 },
                new Produto { Id = 16, Nome = "HyperX Predator 8GB DDR4", Categoria = "Memória RAM", Preco = 189.00m, ImagemUrl = "/images/ram8.png", Descricao = "8GB | DDR4-3200 | CL16 | XMP 2.0 | Low Profile", Estoque = 50 },
                
                // Armazenamento
                new Produto { Id = 4, Nome = "SSD NVMe 1TB Kingston", Categoria = "Armazenamento", Preco = 459.00m, ImagemUrl = "/images/ssd.png", Descricao = "1TB NVMe | 3500MB/s Leitura | 2900MB/s Escrita | PCIe 3.0 | M.2 2280", Estoque = 30 },
                new Produto { Id = 17, Nome = "SSD Samsung 980 PRO 2TB", Categoria = "Armazenamento", Preco = 899.00m, ImagemUrl = "/images/ssd2tb.png", Descricao = "2TB NVMe | 7000MB/s Leitura | 5000MB/s Escrita | PCIe 4.0", Estoque = 12 },
                new Produto { Id = 18, Nome = "HD Seagate 2TB Barracuda", Categoria = "Armazenamento", Preco = 399.00m, ImagemUrl = "/images/hd2tb.png", Descricao = "2TB HDD | 7200RPM | 256MB Cache | SATA III | 3.5\"", Estoque = 25 },
                
                // Fontes
                new Produto { Id = 7, Nome = "Fonte Corsair 650W 80+ Bronze", Categoria = "Fonte", Preco = 449.00m, ImagemUrl = "/images/fonte.png", Descricao = "650W | 80+ Bronze | ATX | Modular | Ventilador 120mm | PFC Ativo", Estoque = 22 },
                new Produto { Id = 19, Nome = "Fonte EVGA 750W 80+ Gold", Categoria = "Fonte", Preco = 649.00m, ImagemUrl = "/images/fonte750.png", Descricao = "750W | 80+ Gold | Full Modular | Silent Fan | 10 Anos Garantia", Estoque = 15 },
                new Produto { Id = 20, Nome = "Fonte Seasonic 550W 80+ Bronze", Categoria = "Fonte", Preco = 349.00m, ImagemUrl = "/images/fonte550.png", Descricao = "550W | 80+ Bronze | Semi-Modular | Ventilador 120mm | Silenciosa", Estoque = 30 },
                
                // Gabinetes
                new Produto { Id = 21, Nome = "Gabinete NZXT H510", Categoria = "Gabinete", Preco = 599.00m, ImagemUrl = "/images/gabinete1.png", Descricao = "Mid-Tower ATX | Vidro Temperado | USB-C | Cable Management | Preto", Estoque = 18 },
                new Produto { Id = 22, Nome = "Gabinete Corsair 4000D Airflow", Categoria = "Gabinete", Preco = 699.00m, ImagemUrl = "/images/gabinete2.png", Descricao = "Mid-Tower ATX | Alto Airflow | Vidro Temperado | 2x Fans 120mm", Estoque = 12 },
                new Produto { Id = 23, Nome = "Gabinete DeepCool Matrexx 55", Categoria = "Gabinete", Preco = 399.00m, ImagemUrl = "/images/gabinete3.png", Descricao = "Mid-Tower ATX | 4x Fans ARGB | Vidro Temperado | USB 3.0", Estoque = 20 },
                
                // Coolers
                new Produto { Id = 24, Nome = "Cooler DeepCool AK400", Categoria = "Cooler", Preco = 199.00m, ImagemUrl = "/images/cooler1.png", Descricao = "Air Cooler | 4 Heatpipes | 120mm Fan | AMD/Intel | 220W TDP", Estoque = 35 },
                new Produto { Id = 25, Nome = "Water Cooler Corsair H100i", Categoria = "Cooler", Preco = 899.00m, ImagemUrl = "/images/watercooler.png", Descricao = "AIO 240mm | 2x Fans RGB | Intel/AMD | Software iCUE | 5 Anos", Estoque = 8 },
                
                // Placas-Mãe
                new Produto { Id = 26, Nome = "Asus B550M-A Prime", Categoria = "Placa-Mãe", Preco = 799.00m, ImagemUrl = "/images/mobo1.png", Descricao = "AMD B550 | Micro-ATX | DDR4 | PCIe 4.0 | M.2 | USB 3.2", Estoque = 15 },
                new Produto { Id = 27, Nome = "Gigabyte Z690 Aorus Elite", Categoria = "Placa-Mãe", Preco = 1499.00m, ImagemUrl = "/images/mobo2.png", Descricao = "Intel Z690 | ATX | DDR5 | PCIe 5.0 | WiFi 6E | 2.5G LAN", Estoque = 6 },
                
                // Periféricos
                new Produto { Id = 8, Nome = "Mouse Gamer Logitech G502", Categoria = "Periféricos", Preco = 349.00m, ImagemUrl = "/images/mouse.png", Descricao = "25.600 DPI | 11 Botões | RGB LIGHTSYNC | Sensor HERO 25K | 89g", Estoque = 35 },
                new Produto { Id = 9, Nome = "Teclado Mecânico RGB", Categoria = "Periféricos", Preco = 299.00m, ImagemUrl = "/images/teclado.png", Descricao = "Switch Blue | ABNT2 | RGB 16.8M cores | Anti-Ghosting | USB", Estoque = 28 },
                new Produto { Id = 10, Nome = "Headset HyperX Cloud II", Categoria = "Periféricos", Preco = 599.00m, ImagemUrl = "/images/headset.png", Descricao = "7.1 Virtual Surround | 53mm Drivers | Microfone Removível | USB/P2", Estoque = 12 },
                
                // Monitores
                new Produto { Id = 28, Nome = "Monitor LG 27\" 144Hz IPS", Categoria = "Monitor", Preco = 1599.00m, ImagemUrl = "/images/monitor1.png", Descricao = "27\" IPS | 1080p | 144Hz | 1ms | FreeSync | HDR10 | HDMI/DP", Estoque = 10 },
                new Produto { Id = 29, Nome = "Monitor Samsung 24\" Curvo", Categoria = "Monitor", Preco = 999.00m, ImagemUrl = "/images/monitor2.png", Descricao = "24\" VA Curvo | 1080p | 75Hz | Eye Saver | HDMI/VGA | VESA", Estoque = 18 },
                new Produto { Id = 30, Nome = "Monitor Gamer ASUS 32\" 165Hz", Categoria = "Monitor", Preco = 2499.00m, ImagemUrl = "/images/monitor3.png", Descricao = "32\" IPS | 1440p | 165Hz | 1ms | G-Sync | HDR400 | USB-C", Estoque = 5 }
            );
        }
    }
}
