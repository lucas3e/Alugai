using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AluguelEquipamentosApi.Models;

public class Mensagem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AluguelId { get; set; }

    [ForeignKey("AluguelId")]
    public virtual Aluguel? Aluguel { get; set; }

    [Required]
    public int RemetenteId { get; set; }

    [ForeignKey("RemetenteId")]
    public virtual Usuario? Remetente { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Conteudo { get; set; } = string.Empty;

    public DateTime DataEnvio { get; set; } = DateTime.UtcNow;

    public bool Lida { get; set; } = false;

    public DateTime? DataLeitura { get; set; }
}
