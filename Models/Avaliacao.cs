using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AluguelEquipamentosApi.Models;

public class Avaliacao
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AluguelId { get; set; }

    [ForeignKey("AluguelId")]
    public virtual Aluguel? Aluguel { get; set; }

    [Required]
    public int EquipamentoId { get; set; }

    [ForeignKey("EquipamentoId")]
    public virtual Equipamento? Equipamento { get; set; }

    [Required]
    public int UsuarioAvaliadorId { get; set; }

    [ForeignKey("UsuarioAvaliadorId")]
    public virtual Usuario? UsuarioAvaliador { get; set; }

    [Required]
    public int UsuarioAvaliadoId { get; set; }

    [ForeignKey("UsuarioAvaliadoId")]
    public virtual Usuario? UsuarioAvaliado { get; set; }

    [Required]
    [Range(1, 5)]
    public int Nota { get; set; }

    [MaxLength(1000)]
    public string? Comentario { get; set; }

    public DateTime DataAvaliacao { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(20)]
    public string TipoAvaliacao { get; set; } = string.Empty; // "Equipamento" ou "Usuario"
}
