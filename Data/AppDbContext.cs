using Microsoft.EntityFrameworkCore;
using AluguelEquipamentosApi.Models;

namespace AluguelEquipamentosApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Equipamento> Equipamentos { get; set; }
    public DbSet<Aluguel> Alugueis { get; set; }
    public DbSet<Avaliacao> Avaliacoes { get; set; }
    public DbSet<Mensagem> Mensagens { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração de Usuario
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Nome).IsRequired();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.SenhaHash).IsRequired();
        });

        // Configuração de Equipamento
        modelBuilder.Entity<Equipamento>(entity =>
        {
            entity.HasOne(e => e.Usuario)
                .WithMany(u => u.Equipamentos)
                .HasForeignKey(e => e.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.Imagens)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null) ?? new List<string>()
                );

            entity.HasIndex(e => e.Categoria);
            entity.HasIndex(e => new { e.Cidade, e.UF });
        });

        // Configuração de Aluguel
        modelBuilder.Entity<Aluguel>(entity =>
        {
            entity.HasOne(a => a.Equipamento)
                .WithMany(e => e.Alugueis)
                .HasForeignKey(a => a.EquipamentoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Locatario)
                .WithMany(u => u.AlugueisComoLocatario)
                .HasForeignKey(a => a.LocatarioId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => a.Status);
            entity.HasIndex(a => new { a.DataInicio, a.DataFim });
        });

        // Configuração de Avaliacao
        modelBuilder.Entity<Avaliacao>(entity =>
        {
            entity.HasOne(a => a.Aluguel)
                .WithOne(al => al.Avaliacao)
                .HasForeignKey<Avaliacao>(a => a.AluguelId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Equipamento)
                .WithMany(e => e.Avaliacoes)
                .HasForeignKey(a => a.EquipamentoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.UsuarioAvaliador)
                .WithMany(u => u.AvaliacoesFeitas)
                .HasForeignKey(a => a.UsuarioAvaliadorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.UsuarioAvaliado)
                .WithMany(u => u.AvaliacoesRecebidas)
                .HasForeignKey(a => a.UsuarioAvaliadoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(a => a.EquipamentoId);
            entity.HasIndex(a => a.UsuarioAvaliadoId);
        });

        // Configuração de Mensagem
        modelBuilder.Entity<Mensagem>(entity =>
        {
            entity.HasOne(m => m.Aluguel)
                .WithMany(a => a.Mensagens)
                .HasForeignKey(m => m.AluguelId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.Remetente)
                .WithMany()
                .HasForeignKey(m => m.RemetenteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(m => m.AluguelId);
            entity.HasIndex(m => m.DataEnvio);
        });

        // Configuração de Transacao
        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.HasOne(t => t.Aluguel)
                .WithMany(a => a.Transacoes)
                .HasForeignKey(t => t.AluguelId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(t => t.MercadoPagoId);
            entity.HasIndex(t => t.Status);
        });
    }
}
