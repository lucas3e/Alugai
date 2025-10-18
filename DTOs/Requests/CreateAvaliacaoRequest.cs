using System.ComponentModel.DataAnnotations;

namespace AluguelEquipamentosApi.DTOs.Requests;

public class CreateAvaliacaoRequest
{
    [Required(ErrorMessage = "O ID do aluguel é obrigatório")]
    public int AluguelId { get; set; }

    [Required(ErrorMessage = "A nota é obrigatória")]
    [Range(1, 5, ErrorMessage = "A nota deve estar entre 1 e 5")]
    public int Nota { get; set; }

    [StringLength(1000, ErrorMessage = "O comentário deve ter no máximo 1000 caracteres")]
    public string? Comentario { get; set; }

    [Required(ErrorMessage = "O tipo de avaliação é obrigatório")]
    [RegularExpression(@"^(Equipamento|Usuario)$", ErrorMessage = "Tipo de avaliação inválido. Use 'Equipamento' ou 'Usuario'")]
    public string TipoAvaliacao { get; set; } = string.Empty;
}
