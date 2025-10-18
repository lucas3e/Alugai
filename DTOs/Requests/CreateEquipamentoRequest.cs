using System.ComponentModel.DataAnnotations;

namespace AluguelEquipamentosApi.DTOs.Requests;

public class CreateEquipamentoRequest
{
    [Required(ErrorMessage = "O título é obrigatório")]
    [StringLength(200, ErrorMessage = "O título deve ter no máximo 200 caracteres")]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(2000, ErrorMessage = "A descrição deve ter no máximo 2000 caracteres")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "A categoria é obrigatória")]
    [StringLength(50, ErrorMessage = "A categoria deve ter no máximo 50 caracteres")]
    public string Categoria { get; set; } = string.Empty;

    [Required(ErrorMessage = "O preço por dia é obrigatório")]
    [Range(0.01, 999999.99, ErrorMessage = "O preço deve estar entre 0.01 e 999999.99")]
    public decimal PrecoPorDia { get; set; }

    [Required(ErrorMessage = "A cidade é obrigatória")]
    [StringLength(100, ErrorMessage = "A cidade deve ter no máximo 100 caracteres")]
    public string Cidade { get; set; } = string.Empty;

    [Required(ErrorMessage = "O UF é obrigatório")]
    [StringLength(2, MinimumLength = 2, ErrorMessage = "O UF deve ter 2 caracteres")]
    [RegularExpression(@"^[A-Z]{2}$", ErrorMessage = "UF inválido")]
    public string UF { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "O endereço deve ter no máximo 200 caracteres")]
    public string? Endereco { get; set; }
}
