using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AluguelEquipamentosApi.Data;
using AluguelEquipamentosApi.DTOs.Requests;
using AluguelEquipamentosApi.DTOs.Responses;
using AluguelEquipamentosApi.Models;
using AluguelEquipamentosApi.Services;

namespace AluguelEquipamentosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlugueisController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;
    private readonly ILogger<AlugueisController> _logger;

    public AlugueisController(
        AppDbContext context,
        IMapper mapper,
        IEmailService emailService,
        ILogger<AlugueisController> logger)
    {
        _context = context;
        _mapper = mapper;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Listar meus aluguéis (como locatário ou proprietário)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMeusAlugueis(
        [FromQuery] string? tipo, // "locatario" ou "proprietario"
        [FromQuery] string? status)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var query = _context.Alugueis
                .Include(a => a.Equipamento)
                    .ThenInclude(e => e.Usuario)
                .Include(a => a.Locatario)
                .Include(a => a.Avaliacao)
                .AsQueryable();

            // Filtrar por tipo
            if (!string.IsNullOrEmpty(tipo))
            {
                if (tipo.ToLower() == "locatario")
                {
                    query = query.Where(a => a.LocatarioId == userId);
                }
                else if (tipo.ToLower() == "proprietario")
                {
                    query = query.Where(a => a.Equipamento!.UsuarioId == userId);
                }
            }
            else
            {
                // Se não especificado, retornar ambos
                query = query.Where(a => a.LocatarioId == userId || a.Equipamento!.UsuarioId == userId);
            }

            // Filtrar por status
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status.ToLower() == status.ToLower());
            }

            var alugueis = await query
                .OrderByDescending(a => a.DataSolicitacao)
                .ToListAsync();

            var response = _mapper.Map<List<AluguelResponse>>(alugueis);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar aluguéis");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter aluguel por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAluguel(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                    .ThenInclude(e => e.Usuario)
                .Include(a => a.Locatario)
                .Include(a => a.Avaliacao)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            // Verificar se o usuário tem permissão para ver este aluguel
            if (aluguel.LocatarioId != userId && aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao obter aluguel {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Solicitar aluguel de equipamento
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SolicitarAluguel([FromBody] CreateAluguelRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            // Buscar equipamento
            var equipamento = await _context.Equipamentos
                .Include(e => e.Usuario)
                .FirstOrDefaultAsync(e => e.Id == request.EquipamentoId);

            if (equipamento == null)
            {
                return BadRequest(new { message = "Equipamento não encontrado" });
            }

            if (!equipamento.Disponivel)
            {
                return BadRequest(new { message = "Equipamento não está disponível" });
            }

            if (equipamento.UsuarioId == userId)
            {
                return BadRequest(new { message = "Você não pode alugar seu próprio equipamento" });
            }

            // Validar datas
            if (request.DataInicio < DateTime.UtcNow.Date)
            {
                return BadRequest(new { message = "A data de início não pode ser no passado" });
            }

            if (request.DataFim <= request.DataInicio)
            {
                return BadRequest(new { message = "A data de fim deve ser posterior à data de início" });
            }

            // Verificar se há conflito de datas
            var conflito = await _context.Alugueis
                .AnyAsync(a => 
                    a.EquipamentoId == request.EquipamentoId &&
                    (a.Status == "Aceito" || a.Status == "EmAndamento") &&
                    ((request.DataInicio >= a.DataInicio && request.DataInicio < a.DataFim) ||
                     (request.DataFim > a.DataInicio && request.DataFim <= a.DataFim) ||
                     (request.DataInicio <= a.DataInicio && request.DataFim >= a.DataFim)));

            if (conflito)
            {
                return BadRequest(new { message = "O equipamento já está reservado para este período" });
            }

            // Calcular valor total
            var dias = (request.DataFim - request.DataInicio).Days;
            var valorTotal = equipamento.PrecoPorDia * dias;

            // Criar aluguel
            var aluguel = _mapper.Map<Aluguel>(request);
            aluguel.LocatarioId = userId;
            aluguel.ValorTotal = valorTotal;
            aluguel.Status = "Pendente";
            aluguel.DataSolicitacao = DateTime.UtcNow;

            _context.Alugueis.Add(aluguel);
            await _context.SaveChangesAsync();

            // Enviar email para o proprietário
            var locatario = await _context.Usuarios.FindAsync(userId);
            await _emailService.SendAluguelSolicitadoEmailAsync(
                equipamento.Usuario!.Email,
                equipamento.Usuario.Nome,
                equipamento.Titulo,
                locatario!.Nome);

            _logger.LogInformation($"Aluguel solicitado: Id={aluguel.Id}, EquipamentoId={request.EquipamentoId}, LocatarioId={userId}");

            // Recarregar com includes para o response
            aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                    .ThenInclude(e => e.Usuario)
                .Include(a => a.Locatario)
                .FirstAsync(a => a.Id == aluguel.Id);

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return CreatedAtAction(nameof(GetAluguel), new { id = aluguel.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao solicitar aluguel");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Aceitar solicitação de aluguel (proprietário)
    /// </summary>
    [HttpPut("{id}/aceitar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AceitarAluguel(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                    .ThenInclude(e => e.Usuario)
                .Include(a => a.Locatario)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            if (aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            if (aluguel.Status != "Pendente")
            {
                return BadRequest(new { message = "Este aluguel não está pendente" });
            }

            aluguel.Status = "Aceito";
            aluguel.DataResposta = DateTime.UtcNow;
            aluguel.ObservacaoProprietario = null;

            await _context.SaveChangesAsync();

            // Enviar email para o locatário
            await _emailService.SendAluguelAceitoEmailAsync(
                aluguel.Locatario!.Email,
                aluguel.Locatario.Nome,
                aluguel.Equipamento.Titulo);

            _logger.LogInformation($"Aluguel aceito: Id={id}");

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao aceitar aluguel {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Recusar solicitação de aluguel (proprietário)
    /// </summary>
    [HttpPut("{id}/recusar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RecusarAluguel(int id, [FromBody] string? observacao)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                    .ThenInclude(e => e.Usuario)
                .Include(a => a.Locatario)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            if (aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            if (aluguel.Status != "Pendente")
            {
                return BadRequest(new { message = "Este aluguel não está pendente" });
            }

            aluguel.Status = "Recusado";
            aluguel.DataResposta = DateTime.UtcNow;
            aluguel.ObservacaoProprietario = observacao;

            await _context.SaveChangesAsync();

            // Enviar email para o locatário
            await _emailService.SendAluguelRecusadoEmailAsync(
                aluguel.Locatario!.Email,
                aluguel.Locatario.Nome,
                aluguel.Equipamento.Titulo);

            _logger.LogInformation($"Aluguel recusado: Id={id}");

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao recusar aluguel {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Cancelar aluguel
    /// </summary>
    [HttpPut("{id}/cancelar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelarAluguel(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            // Apenas o locatário ou proprietário podem cancelar
            if (aluguel.LocatarioId != userId && aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            if (aluguel.Status == "Concluido" || aluguel.Status == "Cancelado")
            {
                return BadRequest(new { message = "Este aluguel não pode ser cancelado" });
            }

            aluguel.Status = "Cancelado";
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Aluguel cancelado: Id={id}");

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao cancelar aluguel {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Concluir aluguel
    /// </summary>
    [HttpPut("{id}/concluir")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ConcluirAluguel(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            // Apenas o proprietário pode concluir
            if (aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            if (aluguel.Status != "EmAndamento")
            {
                return BadRequest(new { message = "Apenas aluguéis em andamento podem ser concluídos" });
            }

            aluguel.Status = "Concluido";
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Aluguel concluído: Id={id}");

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao concluir aluguel {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Confirmar devolução do equipamento (marca aluguel como concluído e equipamento como disponível)
    /// </summary>
    [HttpPut("{id}/confirmar-devolucao")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ConfirmarDevolucao(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var aluguel = await _context.Alugueis
                .Include(a => a.Equipamento)
                .Include(a => a.Locatario)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null)
            {
                return NotFound(new { message = "Aluguel não encontrado" });
            }

            // Apenas o proprietário pode confirmar a devolução
            if (aluguel.Equipamento!.UsuarioId != userId)
            {
                return Forbid();
            }

            if (aluguel.Status != "EmAndamento")
            {
                return BadRequest(new { message = "Apenas aluguéis em andamento podem ter devolução confirmada" });
            }

            // Atualizar status do aluguel
            aluguel.Status = "Concluido";

            // Marcar equipamento como disponível novamente
            aluguel.Equipamento.Disponivel = true;
            aluguel.Equipamento.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Enviar email para o locatário
            await _emailService.SendAluguelConcluidoEmailAsync(
                aluguel.Locatario!.Email,
                aluguel.Locatario.Nome,
                aluguel.Equipamento.Titulo);

            _logger.LogInformation($"Devolução confirmada: AluguelId={id}, EquipamentoId={aluguel.EquipamentoId}");

            var response = _mapper.Map<AluguelResponse>(aluguel);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao confirmar devolução do aluguel {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
