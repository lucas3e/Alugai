using System.ComponentModel.DataAnnotations;

namespace AluguelEquipamentosApi.DTOs.Requests;

public class SendMensagemRequest
{
    [Required(ErrorMessage = "O conteúdo da mensagem é obrigatório")]
    [StringLength(2000, ErrorMessage = "A mensagem deve ter no máximo 2000 caracteres")]
    public string Conteudo { get; set; } = string.Empty;
}
