using System.Net;
using System.Net.Mail;

namespace AluguelEquipamentosApi.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:SmtpUsername"];
            var smtpPassword = _configuration["Email:SmtpPassword"];
            var fromEmail = _configuration["Email:FromEmail"];
            var fromName = _configuration["Email:FromName"];

            // Verificar se as configurações estão definidas
            if (string.IsNullOrEmpty(smtpHost) || 
                string.IsNullOrEmpty(smtpUsername) || 
                smtpUsername == "seu-email@gmail.com")
            {
                _logger.LogWarning("Configurações de email não definidas. Email não será enviado.");
                _logger.LogInformation($"Email simulado - Para: {to}, Assunto: {subject}");
                return;
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword)
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail ?? smtpUsername, fromName ?? "Alugai"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(to);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Email enviado com sucesso para {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao enviar email para {to}");
            // Não lançar exceção para não interromper o fluxo principal
        }
    }

    public async Task SendAluguelSolicitadoEmailAsync(string emailProprietario, string nomeProprietario, string tituloEquipamento, string nomeLocatario)
    {
        var subject = "Nova solicitação de aluguel - Alugai";
        var body = $@"
            <html>
            <body>
                <h2>Olá, {nomeProprietario}!</h2>
                <p>Você recebeu uma nova solicitação de aluguel para o equipamento <strong>{tituloEquipamento}</strong>.</p>
                <p><strong>Solicitante:</strong> {nomeLocatario}</p>
                <p>Acesse a plataforma para aceitar ou recusar a solicitação.</p>
                <br>
                <p>Atenciosamente,<br>Equipe Alugai</p>
            </body>
            </html>
        ";

        await SendEmailAsync(emailProprietario, subject, body);
    }

    public async Task SendAluguelAceitoEmailAsync(string emailLocatario, string nomeLocatario, string tituloEquipamento)
    {
        var subject = "Solicitação de aluguel aceita - Alugai";
        var body = $@"
            <html>
            <body>
                <h2>Olá, {nomeLocatario}!</h2>
                <p>Sua solicitação de aluguel para o equipamento <strong>{tituloEquipamento}</strong> foi aceita!</p>
                <p>Acesse a plataforma para realizar o pagamento e combinar os detalhes com o proprietário.</p>
                <br>
                <p>Atenciosamente,<br>Equipe Alugai</p>
            </body>
            </html>
        ";

        await SendEmailAsync(emailLocatario, subject, body);
    }

    public async Task SendAluguelRecusadoEmailAsync(string emailLocatario, string nomeLocatario, string tituloEquipamento)
    {
        var subject = "Solicitação de aluguel recusada - Alugai";
        var body = $@"
            <html>
            <body>
                <h2>Olá, {nomeLocatario}!</h2>
                <p>Infelizmente, sua solicitação de aluguel para o equipamento <strong>{tituloEquipamento}</strong> foi recusada.</p>
                <p>Não se preocupe! Há muitos outros equipamentos disponíveis na plataforma.</p>
                <br>
                <p>Atenciosamente,<br>Equipe Alugai</p>
            </body>
            </html>
        ";

        await SendEmailAsync(emailLocatario, subject, body);
    }
}
