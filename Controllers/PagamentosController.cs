using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AluguelEquipamentosApi.Services;

namespace AluguelEquipamentosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagamentosController : ControllerBase
{
    private readonly IPagamentoService _pagamentoService;
    private readonly ILogger<PagamentosController> _logger;

    public PagamentosController(
        IPagamentoService pagamentoService,
        ILogger<PagamentosController> logger)
    {
        _pagamentoService = pagamentoService;
        _logger = logger;
    }

    /// <summary>
    /// Iniciar pagamento de um aluguel
    /// </summary>
    [HttpPost("iniciar/{aluguelId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> IniciarPagamento(int aluguelId)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var transacao = await _pagamentoService.IniciarPagamentoAsync(aluguelId, userId);
            
            _logger.LogInformation($"Pagamento iniciado: TransacaoId={transacao.Id}, AluguelId={aluguelId}");

            return Ok(transacao);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (NotImplementedException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao iniciar pagamento do aluguel {aluguelId}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Webhook do Mercado Pago para notificações de pagamento
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> WebhookMercadoPago([FromBody] MercadoPagoWebhookRequest request)
    {
        try
        {
            _logger.LogInformation($"Webhook recebido: Type={request.Type}, PaymentId={request.Data?.Id}");

            if (request.Type != "payment" || string.IsNullOrEmpty(request.Data?.Id))
            {
                return BadRequest(new { message = "Tipo de notificação não suportado" });
            }

            // Processar webhook
            var transacao = await _pagamentoService.ProcessarWebhookAsync(
                request.Data.Id,
                request.Action ?? "pending");

            if (transacao == null)
            {
                return NotFound(new { message = "Transação não encontrada" });
            }

            return Ok(new { message = "Webhook processado com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar webhook do Mercado Pago");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter transação por ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTransacao(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var transacao = await _pagamentoService.GetTransacaoByIdAsync(id);
            
            if (transacao == null)
            {
                return NotFound(new { message = "Transação não encontrada" });
            }

            return Ok(transacao);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao obter transação {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Listar transações do usuário
    /// </summary>
    [HttpGet("usuario/minhas-transacoes")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMinhasTransacoes()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var transacoes = await _pagamentoService.GetTransacoesByUsuarioAsync(userId);
            
            return Ok(transacoes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar transações do usuário");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}

// DTO para webhook do Mercado Pago
public class MercadoPagoWebhookRequest
{
    public string? Type { get; set; }
    public string? Action { get; set; }
    public MercadoPagoWebhookData? Data { get; set; }
}

public class MercadoPagoWebhookData
{
    public string? Id { get; set; }
}
