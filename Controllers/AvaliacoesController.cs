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
[Route("api/[controller]")]
[Authorize]
public class AvaliacoesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<AvaliacoesController> _logger;

    public AvaliacoesController(
        AppDbContext context,
        IMapper mapper,
        ILogger<AvaliacoesController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Criar avaliação
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateAvaliacao([FromBody] CreateAvaliacaoRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            // Buscar aluguel
            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                .Include(a => a.Avaliacao)
                .FirstOrDefaultAsync(a => a.Id == request.AluguelId);

            if (aluguel == null)
            {
                return BadRequest(new { message = "Aluguel não encontrado" });
            }

            // Verificar se o aluguel foi concluído
            if (aluguel.Status != "Concluido")
            {
                return BadRequest(new { message = "Apenas aluguéis concluídos podem ser avaliados" });
            }

            // Verificar se já existe avaliação
            if (aluguel.Avaliacao != null)
            {
                return BadRequest(new { message = "Este aluguel já foi avaliado" });
            }

            // Verificar se o usuário participou do aluguel
            if (aluguel.LocatarioId != userId && aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            // Determinar quem está sendo avaliado
            int usuarioAvaliadoId;
            if (request.TipoAvaliacao == "Equipamento")
            {
                // Locatário avalia o equipamento (e indiretamente o proprietário)
                if (aluguel.LocatarioId != userId)
                {
                    return BadRequest(new { message = "Apenas o locatário pode avaliar o equipamento" });
                }
                usuarioAvaliadoId = aluguel.Equipamento!.UsuarioId;
            }
            else if (request.TipoAvaliacao == "Usuario")
            {
                // Proprietário avalia o locatário
                if (aluguel.Equipamento!.UsuarioId != userId)
                {
                    return BadRequest(new { message = "Apenas o proprietário pode avaliar o locatário" });
                }
                usuarioAvaliadoId = aluguel.LocatarioId;
            }
            else
            {
                return BadRequest(new { message = "Tipo de avaliação inválido" });
            }

            // Criar avaliação
            var avaliacao = _mapper.Map<Avaliacao>(request);
            avaliacao.EquipamentoId = aluguel.EquipamentoId;
            avaliacao.UsuarioAvaliadorId = userId;
            avaliacao.UsuarioAvaliadoId = usuarioAvaliadoId;
            avaliacao.DataAvaliacao = DateTime.UtcNow;

            _context.Avaliacoes.Add(avaliacao);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Avaliação criada: Id={avaliacao.Id}, AluguelId={request.AluguelId}, Tipo={request.TipoAvaliacao}");

            // Recarregar com includes para o response
            avaliacao = await _context.Avaliacoes
                .Include(a => a.UsuarioAvaliador)
                .Include(a => a.UsuarioAvaliado)
                .FirstAsync(a => a.Id == avaliacao.Id);

            var response = _mapper.Map<AvaliacaoResponse>(avaliacao);
            return CreatedAtAction(nameof(GetAvaliacao), new { id = avaliacao.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar avaliação");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter avaliação por ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAvaliacao(int id)
    {
        try
        {
            var avaliacao = await _context.Avaliacoes
                .Include(a => a.UsuarioAvaliador)
                .Include(a => a.UsuarioAvaliado)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (avaliacao == null)
            {
                return NotFound(new { message = "Avaliação não encontrada" });
            }

            var response = _mapper.Map<AvaliacaoResponse>(avaliacao);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao obter avaliação {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Listar avaliações de um equipamento
    /// </summary>
    [HttpGet("equipamento/{equipamentoId}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAvaliacoesByEquipamento(int equipamentoId)
    {
        try
        {
            var avaliacoes = await _context.Avaliacoes
                .Include(a => a.UsuarioAvaliador)
                .Include(a => a.UsuarioAvaliado)
                .Where(a => a.EquipamentoId == equipamentoId && a.TipoAvaliacao == "Equipamento")
                .OrderByDescending(a => a.DataAvaliacao)
                .ToListAsync();

            var response = _mapper.Map<List<AvaliacaoResponse>>(avaliacoes);
            
            var mediaNotas = avaliacoes.Any() ? avaliacoes.Average(a => a.Nota) : 0;
            
            return Ok(new
            {
                avaliacoes = response,
                mediaNotas,
                totalAvaliacoes = avaliacoes.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao listar avaliações do equipamento {equipamentoId}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Listar avaliações de um usuário
    /// </summary>
    [HttpGet("usuario/{usuarioId}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAvaliacoesByUsuario(int usuarioId)
    {
        try
        {
            var avaliacoes = await _context.Avaliacoes
                .Include(a => a.UsuarioAvaliador)
                .Include(a => a.UsuarioAvaliado)
                .Where(a => a.UsuarioAvaliadoId == usuarioId)
                .OrderByDescending(a => a.DataAvaliacao)
                .ToListAsync();

            var response = _mapper.Map<List<AvaliacaoResponse>>(avaliacoes);
            
            var mediaNotas = avaliacoes.Any() ? avaliacoes.Average(a => a.Nota) : 0;
            
            return Ok(new
            {
                avaliacoes = response,
                mediaNotas,
                totalAvaliacoes = avaliacoes.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao listar avaliações do usuário {usuarioId}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Deletar avaliação (apenas o autor)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAvaliacao(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var avaliacao = await _context.Avaliacoes.FindAsync(id);
            if (avaliacao == null)
            {
                return NotFound(new { message = "Avaliação não encontrada" });
            }

            if (avaliacao.UsuarioAvaliadorId != userId)
            {
                return Forbid();
            }

            _context.Avaliacoes.Remove(avaliacao);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Avaliação deletada: Id={id}");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao deletar avaliação {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
