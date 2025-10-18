using AluguelEquipamentosApi.DTOs.Requests;
using AluguelEquipamentosApi.DTOs.Responses;

namespace AluguelEquipamentosApi.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UsuarioResponse?> GetUsuarioByIdAsync(int id);
    Task<UsuarioResponse?> UpdateUsuarioAsync(int id, RegisterRequest request);
}
