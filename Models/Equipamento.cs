using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AluguelEquipamentosApi.Models;

public class Equipamento
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Categoria { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal PrecoPorDia { get; set; }

    [Required]
    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    [Required]
    [MaxLength(2)]
    public string UF { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Endereco { get; set; }

    public string? Imagem { get; set; }

    public bool Disponivel { get; set; } = true;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public DateTime? DataAtualizacao { get; set; }

    // Relacionamentos
    [Required]
    public int UsuarioId { get; set; }

    [ForeignKey("UsuarioId")]
    public virtual Usuario? Usuario { get; set; }

    public virtual ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    public virtual ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();
}
