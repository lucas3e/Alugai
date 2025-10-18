using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AluguelEquipamentosApi.Data;
using AluguelEquipamentosApi.DTOs.Requests;
using AluguelEquipamentosApi.DTOs.Responses;
using AluguelEquipamentosApi.Models;

namespace AluguelEquipamentosApi.Controllers;

[ApiController]
[Route("api/alugueis/{aluguelId}/mensagens")]
[Authorize]
public class MensagensController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<MensagensController> _logger;

    public MensagensController(
        AppDbContext context,
        IMapper mapper,
        ILogger<MensagensController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Listar mensagens de um aluguel
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMensagens(int aluguelId)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            // Verificar se o aluguel existe e se o usuário tem permissão
            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                .FirstOrDefaultAsync(a => a.Id == aluguelId);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            if (aluguel.LocatarioId != userId && aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            // Buscar mensagens
            var mensagens = await _context.Mensagens
                .Include(m => m.Remetente)
                .Where(m => m.AluguelId == aluguelId)
                .OrderBy(m => m.DataEnvio)
                .ToListAsync();

            // Marcar mensagens como lidas
            var mensagensNaoLidas = mensagens
                .Where(m => !m.Lida && m.RemetenteId != userId)
                .ToList();

            foreach (var mensagem in mensagensNaoLidas)
            {
                mensagem.Lida = true;
                mensagem.DataLeitura = DateTime.UtcNow;
            }

            if (mensagensNaoLidas.Any())
            {
                await _context.SaveChangesAsync();
            }

            var response = _mapper.Map<List<MensagemResponse>>(mensagens);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao listar mensagens do aluguel {aluguelId}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Enviar mensagem em um aluguel
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EnviarMensagem(int aluguelId, [FromBody] SendMensagemRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            // Verificar se o aluguel existe e se o usuário tem permissão
            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                .FirstOrDefaultAsync(a => a.Id == aluguelId);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            if (aluguel.LocatarioId != userId && aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            // Criar mensagem
            var mensagem = _mapper.Map<Mensagem>(request);
            mensagem.AluguelId = aluguelId;
            mensagem.RemetenteId = userId;
            mensagem.DataEnvio = DateTime.UtcNow;

            _context.Mensagens.Add(mensagem);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Mensagem enviada: AluguelId={aluguelId}, RemetenteId={userId}");

            // Recarregar com includes para o response
            mensagem = await _context.Mensagens
                .Include(m => m.Remetente)
                .FirstAsync(m => m.Id == mensagem.Id);

            var response = _mapper.Map<MensagemResponse>(mensagem);
            return CreatedAtAction(nameof(GetMensagens), new { aluguelId }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao enviar mensagem no aluguel {aluguelId}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter contagem de mensagens não lidas
    /// </summary>
    [HttpGet("~/api/mensagens/nao-lidas")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMensagensNaoLidas()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            // Buscar aluguéis do usuário
            var alugueisIds = await _context.Alugueis
                .Include(a => a.Equipamento)
                .Where(a => a.LocatarioId == userId || a.Equipamento!.UsuarioId == userId)
                .Select(a => a.Id)
                .ToListAsync();

            // Contar mensagens não lidas
            var count = await _context.Mensagens
                .Where(m => alugueisIds.Contains(m.AluguelId) && !m.Lida && m.RemetenteId != userId)
                .CountAsync();

            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter contagem de mensagens não lidas");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
