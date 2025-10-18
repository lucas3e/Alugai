namespace AluguelEquipamentosApi.DTOs.Responses;

public class UsuarioResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FotoPerfil { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public string UF { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public DateTime DataCriacao { get; set; }
    public double? MediaAvaliacoes { get; set; }
    public int TotalAvaliacoes { get; set; }
}
