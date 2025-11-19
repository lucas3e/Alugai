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
public class EquipamentosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IStorageService _storageService;
    private readonly ILogger<EquipamentosController> _logger;

    public EquipamentosController(
        AppDbContext context,
        IMapper mapper,
        IStorageService storageService,
        ILogger<EquipamentosController> logger)
    {
        _context = context;
        _mapper = mapper;
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Listar equipamentos com filtros
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEquipamentos(
        [FromQuery] string? categoria,
        [FromQuery] string? cidade,
        [FromQuery] string? uf,
        [FromQuery] decimal? precoMin,
        [FromQuery] decimal? precoMax,
        [FromQuery] string? busca,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = _context.Equipamentos
                .Include(e => e.Usuario)
                .Include(e => e.Avaliacoes)
                .Where(e => e.Disponivel)
                .AsQueryable();

            // Aplicar filtros
            if (!string.IsNullOrEmpty(categoria))
            {
                query = query.Where(e => e.Categoria.ToLower() == categoria.ToLower());
            }

            if (!string.IsNullOrEmpty(cidade))
            {
                query = query.Where(e => e.Cidade.ToLower().Contains(cidade.ToLower()));
            }

            if (!string.IsNullOrEmpty(uf))
            {
                query = query.Where(e => e.UF.ToUpper() == uf.ToUpper());
            }

            if (precoMin.HasValue)
            {
                query = query.Where(e => e.PrecoPorDia >= precoMin.Value);
            }

            if (precoMax.HasValue)
            {
                query = query.Where(e => e.PrecoPorDia <= precoMax.Value);
            }

            if (!string.IsNullOrEmpty(busca))
            {
                query = query.Where(e => 
                    e.Titulo.ToLower().Contains(busca.ToLower()) ||
                    e.Descricao.ToLower().Contains(busca.ToLower()));
            }

            // Paginação
            var total = await query.CountAsync();
            var equipamentos = await query
                .OrderByDescending(e => e.DataCriacao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = _mapper.Map<List<EquipamentoResponse>>(equipamentos);

            return Ok(new
            {
                data = response,
                page,
                pageSize,
                total,
                totalPages = (int)Math.Ceiling(total / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar equipamentos");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obter equipamento por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEquipamento(int id)
    {
        try
        {
            var equipamento = await _context.Equipamentos
                .Include(e => e.Usuario)
                .Include(e => e.Avaliacoes)
                    .ThenInclude(a => a.UsuarioAvaliador)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (equipamento == null)
            {
                return NotFound(new { message = "Equipamento não encontrado" });
            }

            var response = _mapper.Map<EquipamentoResponse>(equipamento);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao obter equipamento {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Criar novo equipamento
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateEquipamento([FromBody] CreateEquipamentoRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var equipamento = _mapper.Map<Equipamento>(request);
            equipamento.UsuarioId = userId;
            equipamento.DataCriacao = DateTime.UtcNow;

            _context.Equipamentos.Add(equipamento);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Equipamento criado: Id={equipamento.Id}, UserId={userId}");

            var response = _mapper.Map<EquipamentoResponse>(equipamento);
            return CreatedAtAction(nameof(GetEquipamento), new { id = equipamento.Id }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar equipamento");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Atualizar equipamento
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateEquipamento(int id, [FromBody] UpdateEquipamentoRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var equipamento = await _context.Equipamentos.FindAsync(id);
            if (equipamento == null)
            {
                return NotFound(new { message = "Equipamento não encontrado" });
            }

            if (equipamento.UsuarioId != userId)
            {
                return Forbid();
            }

            // Atualizar apenas os campos fornecidos
            if (!string.IsNullOrEmpty(request.Titulo))
                equipamento.Titulo = request.Titulo;
            
            if (!string.IsNullOrEmpty(request.Descricao))
                equipamento.Descricao = request.Descricao;
            
            if (!string.IsNullOrEmpty(request.Categoria))
                equipamento.Categoria = request.Categoria;
            
            if (request.PrecoPorDia.HasValue)
                equipamento.PrecoPorDia = request.PrecoPorDia.Value;
            
            if (!string.IsNullOrEmpty(request.Cidade))
                equipamento.Cidade = request.Cidade;
            
            if (!string.IsNullOrEmpty(request.UF))
                equipamento.UF = request.UF;
            
            if (request.Endereco != null)
                equipamento.Endereco = request.Endereco;
            
            if (request.Disponivel.HasValue)
                equipamento.Disponivel = request.Disponivel.Value;

            equipamento.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Equipamento atualizado: Id={id}");

            var response = _mapper.Map<EquipamentoResponse>(equipamento);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao atualizar equipamento {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Deletar equipamento
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEquipamento(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var equipamento = await _context.Equipamentos.FindAsync(id);
            if (equipamento == null)
            {
                return NotFound(new { message = "Equipamento não encontrado" });
            }

            if (equipamento.UsuarioId != userId)
            {
                return Forbid();
            }

            // Não precisa deletar imagens Base64 do storage
            _context.Equipamentos.Remove(equipamento);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Equipamento deletado: Id={id}");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao deletar equipamento {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Upload de imagens do equipamento
    /// </summary>
    [HttpPost("{id}/imagens")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadImagens(int id, [FromForm] List<IFormFile> imagens)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var equipamento = await _context.Equipamentos.FindAsync(id);
            if (equipamento == null)
            {
                return NotFound(new { message = "Equipamento não encontrado" });
            }

            if (equipamento.UsuarioId != userId)
            {
                return Forbid();
            }

            if (imagens == null || !imagens.Any())
            {
                return BadRequest(new { message = "Nenhuma imagem fornecida" });
            }

            // Converter imagens para Base64
            var base64Images = await _storageService.ConvertToBase64Async(imagens);
            
            // Adicionar Base64 às imagens do equipamento
            equipamento.Imagens.AddRange(base64Images);
            equipamento.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Imagens adicionadas ao equipamento: Id={id}, Quantidade={base64Images.Count}");

            return Ok(new { imagens = equipamento.Imagens });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao fazer upload de imagens do equipamento {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Remover imagem do equipamento
    /// </summary>
    [HttpDelete("{id}/imagens")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoverImagem(int id, [FromQuery] string imageBase64)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var equipamento = await _context.Equipamentos.FindAsync(id);
            if (equipamento == null)
            {
                return NotFound(new { message = "Equipamento não encontrado" });
            }

            if (equipamento.UsuarioId != userId)
            {
                return Forbid();
            }

            if (string.IsNullOrEmpty(imageBase64))
            {
                return BadRequest(new { message = "Imagem não fornecida" });
            }

            if (!equipamento.Imagens.Contains(imageBase64))
            {
                return BadRequest(new { message = "Imagem não encontrada no equipamento" });
            }

            // Remover Base64 da lista (não precisa deletar do storage)
            equipamento.Imagens.Remove(imageBase64);
            equipamento.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Imagem removida do equipamento: Id={id}");

            return Ok(new { imagens = equipamento.Imagens });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao remover imagem do equipamento {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
