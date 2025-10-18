using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AluguelEquipamentosApi.Data;
using AluguelEquipamentosApi.DTOs.Requests;
using AluguelEquipamentosApi.DTOs.Responses;
using AluguelEquipamentosApi.Helpers;
using AluguelEquipamentosApi.Models;

namespace AluguelEquipamentosApi.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly JwtHelper _jwtHelper;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IMapper mapper, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
        _jwtHelper = new JwtHelper(configuration);
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Verificar se o email já existe
        if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
        {
            throw new InvalidOperationException("Email já cadastrado");
        }

        // Criar novo usuário
        var usuario = _mapper.Map<Usuario>(request);
        usuario.SenhaHash = PasswordHelper.HashPassword(request.Senha);
        usuario.DataCriacao = DateTime.UtcNow;

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        // Gerar token JWT
        var token = _jwtHelper.GenerateToken(usuario.Id, usuario.Email, usuario.Nome);
        var expirationMinutes = int.Parse(_configuration["JwtSettings:ExpirationInMinutes"] ?? "1440");

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            Usuario = _mapper.Map<UsuarioResponse>(usuario)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Buscar usuário por email
        var usuario = await _context.Usuarios
            .Include(u => u.AvaliacoesRecebidas)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null)
        {
            throw new UnauthorizedAccessException("Email ou senha inválidos");
        }

        // Verificar senha
        if (!PasswordHelper.VerifyPassword(request.Senha, usuario.SenhaHash))
        {
            throw new UnauthorizedAccessException("Email ou senha inválidos");
        }

        // Verificar se o usuário está ativo
        if (!usuario.Ativo)
        {
            throw new UnauthorizedAccessException("Usuário inativo");
        }

        // Gerar token JWT
        var token = _jwtHelper.GenerateToken(usuario.Id, usuario.Email, usuario.Nome);
        var expirationMinutes = int.Parse(_configuration["JwtSettings:ExpirationInMinutes"] ?? "1440");

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            Usuario = _mapper.Map<UsuarioResponse>(usuario)
        };
    }

    public async Task<UsuarioResponse?> GetUsuarioByIdAsync(int id)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.AvaliacoesRecebidas)
            .FirstOrDefaultAsync(u => u.Id == id);

        return usuario != null ? _mapper.Map<UsuarioResponse>(usuario) : null;
    }

    public async Task<UsuarioResponse?> UpdateUsuarioAsync(int id, RegisterRequest request)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            return null;
        }

        // Verificar se o novo email já está em uso por outro usuário
        if (request.Email != usuario.Email && 
            await _context.Usuarios.AnyAsync(u => u.Email == request.Email && u.Id != id))
        {
            throw new InvalidOperationException("Email já cadastrado");
        }

        usuario.Nome = request.Nome;
        usuario.Email = request.Email;
        usuario.Cidade = request.Cidade;
        usuario.UF = request.UF;
        usuario.Telefone = request.Telefone;
        usuario.DataAtualizacao = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Senha))
        {
            usuario.SenhaHash = PasswordHelper.HashPassword(request.Senha);
        }

        await _context.SaveChangesAsync();

        return _mapper.Map<UsuarioResponse>(usuario);
    }
}
