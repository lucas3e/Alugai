namespace AluguelEquipamentosApi.DTOs.Responses;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UsuarioResponse Usuario { get; set; } = null!;
}
