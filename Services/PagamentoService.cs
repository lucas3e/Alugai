using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AluguelEquipamentosApi.Data;
using AluguelEquipamentosApi.DTOs.Responses;
using AluguelEquipamentosApi.Models;

namespace AluguelEquipamentosApi.Services;

public class PagamentoService : IPagamentoService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PagamentoService> _logger;

    public PagamentoService(
        AppDbContext context, 
        IMapper mapper, 
        IConfiguration configuration,
        ILogger<PagamentoService> logger)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<TransacaoResponse> IniciarPagamentoAsync(int aluguelId, int usuarioId)
    {
        // Buscar aluguel
        var aluguel = await _context.Alugueis
            .Include(a => a.Equipamento)
            .Include(a => a.Locatario)
            .FirstOrDefaultAsync(a => a.Id == aluguelId);

        if (aluguel == null)
        {
            throw new InvalidOperationException("Aluguel não encontrado");
        }

        // Verificar se o usuário é o locatário
        if (aluguel.LocatarioId != usuarioId)
        {
            throw new UnauthorizedAccessException("Você não tem permissão para pagar este aluguel");
        }

        // Verificar se o aluguel foi aceito
        if (aluguel.Status != "Aceito")
        {
            throw new InvalidOperationException("O aluguel precisa ser aceito antes do pagamento");
        }

        // Verificar se já existe uma transação aprovada
        var transacaoExistente = await _context.Transacoes
            .FirstOrDefaultAsync(t => t.AluguelId == aluguelId && t.Status == "Aprovado");

        if (transacaoExistente != null)
        {
            throw new InvalidOperationException("Este aluguel já foi pago");
        }

        try
        {
            // Criar transação
            var transacao = new Transacao
            {
                AluguelId = aluguelId,
                ValorPago = aluguel.ValorTotal,
                Status = "Pendente",
                DataCriacao = DateTime.UtcNow
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            // TODO: Integrar com Mercado Pago
            // Por enquanto, simular criação de preferência de pagamento
            var accessToken = _configuration["MercadoPago:AccessToken"];
            
            if (string.IsNullOrEmpty(accessToken) || accessToken == "seu-access-token-do-mercado-pago-sandbox")
            {
                _logger.LogWarning("Mercado Pago não configurado. Simulando pagamento...");
                
                // Simular ID do Mercado Pago
                transacao.MercadoPagoId = $"MP-{Guid.NewGuid()}";
                transacao.DetalhesResposta = "Pagamento simulado - Configure o Mercado Pago para pagamentos reais";
                await _context.SaveChangesAsync();
            }
            else
            {
                // Aqui você implementaria a integração real com o Mercado Pago
                // Exemplo:
                // var preference = await CreateMercadoPagoPreference(aluguel, transacao);
                // transacao.MercadoPagoId = preference.Id;
                // await _context.SaveChangesAsync();
                
                throw new NotImplementedException("Integração com Mercado Pago ainda não implementada. Configure as credenciais no appsettings.json");
            }

            return _mapper.Map<TransacaoResponse>(transacao);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao iniciar pagamento");
            throw;
        }
    }

    public async Task<TransacaoResponse?> ProcessarWebhookAsync(string paymentId, string status)
    {
        try
        {
            // Buscar transação pelo ID do Mercado Pago
            var transacao = await _context.Transacoes
                .Include(t => t.Aluguel)
                .FirstOrDefaultAsync(t => t.MercadoPagoPaymentId == paymentId);

            if (transacao == null)
            {
                _logger.LogWarning($"Transação não encontrada para paymentId: {paymentId}");
                return null;
            }

            // Atualizar status da transação
            var statusAnterior = transacao.Status;
            transacao.Status = status switch
            {
                "approved" => "Aprovado",
                "rejected" => "Recusado",
                "cancelled" => "Cancelado",
                "refunded" => "Reembolsado",
                _ => "Pendente"
            };

            transacao.DataAtualizacao = DateTime.UtcNow;

            // Se o pagamento foi aprovado, atualizar status do aluguel
            if (transacao.Status == "Aprovado" && statusAnterior != "Aprovado")
            {
                var aluguel = transacao.Aluguel;
                if (aluguel != null)
                {
                    aluguel.Status = "EmAndamento";
                }
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Webhook processado: PaymentId={paymentId}, Status={status}");

            return _mapper.Map<TransacaoResponse>(transacao);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao processar webhook: PaymentId={paymentId}");
            throw;
        }
    }

    public async Task<TransacaoResponse?> GetTransacaoByIdAsync(int id)
    {
        var transacao = await _context.Transacoes
            .FirstOrDefaultAsync(t => t.Id == id);

        return transacao != null ? _mapper.Map<TransacaoResponse>(transacao) : null;
    }

    public async Task<List<TransacaoResponse>> GetTransacoesByUsuarioAsync(int usuarioId)
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Aluguel)
                .ThenInclude(a => a.Locatario)
            .Where(t => t.Aluguel!.LocatarioId == usuarioId || t.Aluguel!.Equipamento!.UsuarioId == usuarioId)
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return _mapper.Map<List<TransacaoResponse>>(transacoes);
    }

    // Método privado para criar preferência no Mercado Pago (exemplo)
    // private async Task<MercadoPagoPreference> CreateMercadoPagoPreference(Aluguel aluguel, Transacao transacao)
    // {
    //     // Implementar integração com SDK do Mercado Pago
    //     // Retornar preferência criada
    // }
}
