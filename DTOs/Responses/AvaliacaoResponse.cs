namespace AluguelEquipamentosApi.DTOs.Responses;

public class AvaliacaoResponse
{
    public int Id { get; set; }
    public int AluguelId { get; set; }
    public int EquipamentoId { get; set; }
    public int UsuarioAvaliadorId { get; set; }
    public string NomeAvaliador { get; set; } = string.Empty;
    public string? FotoPerfilAvaliador { get; set; }
    public int UsuarioAvaliadoId { get; set; }
    public string NomeAvaliado { get; set; } = string.Empty;
    public int Nota { get; set; }
    public string? Comentario { get; set; }
    public DateTime DataAvaliacao { get; set; }
    public string TipoAvaliacao { get; set; } = string.Empty;
}
