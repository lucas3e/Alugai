using AluguelEquipamentosApi.DTOs.Responses;

namespace AluguelEquipamentosApi.Services;

public interface IPagamentoService
{
    Task<TransacaoResponse> IniciarPagamentoAsync(int aluguelId, int usuarioId);
    Task<TransacaoResponse?> ProcessarWebhookAsync(string paymentId, string status);
    Task<TransacaoResponse?> GetTransacaoByIdAsync(int id);
    Task<List<TransacaoResponse>> GetTransacoesByUsuarioAsync(int usuarioId);
}
