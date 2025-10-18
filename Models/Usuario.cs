using System.ComponentModel.DataAnnotations;

namespace AluguelEquipamentosApi.Models;

public class Usuario
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string SenhaHash { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? FotoPerfil { get; set; }

    [Required]
    [MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    [Required]
    [MaxLength(2)]
    public string UF { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Telefone { get; set; }

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public DateTime? DataAtualizacao { get; set; }

    public bool Ativo { get; set; } = true;

    // Relacionamentos
    public virtual ICollection<Equipamento> Equipamentos { get; set; } = new List<Equipamento>();
    public virtual ICollection<Aluguel> AlugueisComoLocatario { get; set; } = new List<Aluguel>();
    public virtual ICollection<Avaliacao> AvaliacoesRecebidas { get; set; } = new List<Avaliacao>();
    public virtual ICollection<Avaliacao> AvaliacoesFeitas { get; set; } = new List<Avaliacao>();
}
