namespace AluguelEquipamentosApi.DTOs.Responses;

public class MensagemResponse
{
    public int Id { get; set; }
    public int AluguelId { get; set; }
    public int RemetenteId { get; set; }
    public string NomeRemetente { get; set; } = string.Empty;
    public string? FotoPerfilRemetente { get; set; }
    public string Conteudo { get; set; } = string.Empty;
    public DateTime DataEnvio { get; set; }
    public bool Lida { get; set; }
    public DateTime? DataLeitura { get; set; }
}
