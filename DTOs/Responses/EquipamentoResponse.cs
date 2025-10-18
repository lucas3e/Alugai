namespace AluguelEquipamentosApi.DTOs.Responses;

public class EquipamentoResponse
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal PrecoPorDia { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public string UF { get; set; } = string.Empty;
    public string? Endereco { get; set; }
    public List<string> Imagens { get; set; } = new List<string>();
    public bool Disponivel { get; set; }
    public DateTime DataCriacao { get; set; }
    public int UsuarioId { get; set; }
    public string NomeProprietario { get; set; } = string.Empty;
    public string? FotoPerfilProprietario { get; set; }
    public double? MediaAvaliacoes { get; set; }
    public int TotalAvaliacoes { get; set; }
}
