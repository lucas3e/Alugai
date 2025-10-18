using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AluguelEquipamentosApi.Data;
using AluguelEquipamentosApi.DTOs.Responses;
using AluguelEquipamentosApi.Services;

namespace AluguelEquipamentosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IStorageService _storageService;
    private readonly ILogger<UsuariosController> _logger;

    public UsuariosController(
        AppDbContext context,
        IMapper mapper,
        IStorageService storageService,
        ILogger<UsuariosController> logger)
    {
        _context = context;
        _mapper = mapper;
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Obter perfil público de um usuário
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUsuario(int id)
    {
        try
        {
            var usuario = await _context.Usuarios
                .Include(u => u.AvaliacoesRecebidas)
                .FirstOrDefaultAsync(u => u.Id == id && u.Ativo);

            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            var response = _mapper.Map<UsuarioResponse>(usuario);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao obter usuário {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Listar equipamentos de um usuário
    /// </summary>
    [HttpGet("{id}/equipamentos")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEquipamentosUsuario(int id)
    {
        try
        {
            var equipamentos = await _context.Equipamentos
                .Include(e => e.Usuario)
                .Include(e => e.Avaliacoes)
                .Where(e => e.UsuarioId == id && e.Disponivel)
                .OrderByDescending(e => e.DataCriacao)
                .ToListAsync();

            var response = _mapper.Map<List<EquipamentoResponse>>(equipamentos);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao listar equipamentos do usuário {id}");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Upload de foto de perfil
    /// </summary>
    [HttpPost("foto-perfil")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UploadFotoPerfil([FromForm] IFormFile foto)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var usuario = await _context.Usuarios.FindAsync(userId);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            if (foto == null || foto.Length == 0)
            {
                return BadRequest(new { message = "Nenhuma foto fornecida" });
            }

            // Deletar foto antiga se existir
            if (!string.IsNullOrEmpty(usuario.FotoPerfil))
            {
                await _storageService.DeleteImageAsync(usuario.FotoPerfil);
            }

            // Upload da nova foto
            var fotoUrl = await _storageService.UploadImageAsync(foto, "perfis");
            
            usuario.FotoPerfil = fotoUrl;
            usuario.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Foto de perfil atualizada: UserId={userId}");

            return Ok(new { fotoUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fazer upload de foto de perfil");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Remover foto de perfil
    /// </summary>
    [HttpDelete("foto-perfil")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoverFotoPerfil()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var usuario = await _context.Usuarios.FindAsync(userId);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            if (!string.IsNullOrEmpty(usuario.FotoPerfil))
            {
                await _storageService.DeleteImageAsync(usuario.FotoPerfil);
                usuario.FotoPerfil = null;
                usuario.DataAtualizacao = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation($"Foto de perfil removida: UserId={userId}");

            return Ok(new { message = "Foto de perfil removida com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao remover foto de perfil");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
