using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AluguelEquipamentosApi.Models;

public class Aluguel
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int EquipamentoId { get; set; }

    [ForeignKey("EquipamentoId")]
    public virtual Equipamento? Equipamento { get; set; }

    [Required]
    public int LocatarioId { get; set; }

    [ForeignKey("LocatarioId")]
    public virtual Usuario? Locatario { get; set; }

    [Required]
    public DateTime DataInicio { get; set; }

    [Required]
    public DateTime DataFim { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal ValorTotal { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pendente"; // Pendente, Aceito, Recusado, EmAndamento, Concluido, Cancelado

    public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;

    public DateTime? DataResposta { get; set; }

    [MaxLength(500)]
    public string? ObservacaoLocatario { get; set; }

    [MaxLength(500)]
    public string? ObservacaoProprietario { get; set; }

    // Relacionamentos
    public virtual ICollection<Mensagem> Mensagens { get; set; } = new List<Mensagem>();
    public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    public virtual Avaliacao? Avaliacao { get; set; }
}
