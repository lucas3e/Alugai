namespace AluguelEquipamentosApi.DTOs.Responses;

public class AluguelResponse
{
    public int Id { get; set; }
    public int EquipamentoId { get; set; }
    public string TituloEquipamento { get; set; } = string.Empty;
    public List<string> ImagensEquipamento { get; set; } = new List<string>();
    public int LocatarioId { get; set; }
    public string NomeLocatario { get; set; } = string.Empty;
    public string? FotoPerfilLocatario { get; set; }
    public int ProprietarioId { get; set; }
    public string NomeProprietario { get; set; } = string.Empty;
    public string? FotoPerfilProprietario { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime DataSolicitacao { get; set; }
    public DateTime? DataResposta { get; set; }
    public string? ObservacaoLocatario { get; set; }
    public string? ObservacaoProprietario { get; set; }
    public bool PodeAvaliar { get; set; }
    public bool JaAvaliado { get; set; }
}
