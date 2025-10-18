namespace AluguelEquipamentosApi.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendAluguelSolicitadoEmailAsync(string emailProprietario, string nomeProprietario, string tituloEquipamento, string nomeLocatario);
    Task SendAluguelAceitoEmailAsync(string emailLocatario, string nomeLocatario, string tituloEquipamento);
    Task SendAluguelRecusadoEmailAsync(string emailLocatario, string nomeLocatario, string tituloEquipamento);
}
