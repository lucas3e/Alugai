using System.ComponentModel.DataAnnotations;

namespace AluguelEquipamentosApi.DTOs.Requests;

public class CreateAluguelRequest
{
    [Required(ErrorMessage = "O ID do equipamento é obrigatório")]
    public int EquipamentoId { get; set; }

    [Required(ErrorMessage = "A data de início é obrigatória")]
    public DateTime DataInicio { get; set; }

    [Required(ErrorMessage = "A data de fim é obrigatória")]
    public DateTime DataFim { get; set; }

    [StringLength(500, ErrorMessage = "A observação deve ter no máximo 500 caracteres")]
    public string? ObservacaoLocatario { get; set; }
}
