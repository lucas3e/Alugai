using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AluguelEquipamentosApi.Models;

public class Transacao
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AluguelId { get; set; }

    [ForeignKey("AluguelId")]
    public virtual Aluguel? Aluguel { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal ValorPago { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pendente"; // Pendente, Aprovado, Recusado, Cancelado, Reembolsado

    [MaxLength(200)]
    public string? MercadoPagoId { get; set; }

    [MaxLength(200)]
    public string? MercadoPagoPaymentId { get; set; }

    [MaxLength(50)]
    public string? MetodoPagamento { get; set; }

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public DateTime? DataAtualizacao { get; set; }

    [MaxLength(1000)]
    public string? DetalhesResposta { get; set; }
}
