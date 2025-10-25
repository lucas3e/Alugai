using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AluguelEquipamentosApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    SenhaHash = table.Column<string>(type: "text", nullable: false),
                    FotoPerfil = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Equipamentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titulo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PrecoPorDia = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UF = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Endereco = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Imagens = table.Column<string>(type: "text", nullable: false),
                    Disponivel = table.Column<bool>(type: "boolean", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Equipamentos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Alugueis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EquipamentoId = table.Column<int>(type: "integer", nullable: false),
                    LocatarioId = table.Column<int>(type: "integer", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ValorTotal = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DataSolicitacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataResposta = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ObservacaoLocatario = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ObservacaoProprietario = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alugueis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alugueis_Equipamentos_EquipamentoId",
                        column: x => x.EquipamentoId,
                        principalTable: "Equipamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Alugueis_Usuarios_LocatarioId",
                        column: x => x.LocatarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Avaliacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AluguelId = table.Column<int>(type: "integer", nullable: false),
                    EquipamentoId = table.Column<int>(type: "integer", nullable: false),
                    UsuarioAvaliadorId = table.Column<int>(type: "integer", nullable: false),
                    UsuarioAvaliadoId = table.Column<int>(type: "integer", nullable: false),
                    Nota = table.Column<int>(type: "integer", nullable: false),
                    Comentario = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    DataAvaliacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TipoAvaliacao = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avaliacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Avaliacoes_Alugueis_AluguelId",
                        column: x => x.AluguelId,
                        principalTable: "Alugueis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Avaliacoes_Equipamentos_EquipamentoId",
                        column: x => x.EquipamentoId,
                        principalTable: "Equipamentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Avaliacoes_Usuarios_UsuarioAvaliadoId",
                        column: x => x.UsuarioAvaliadoId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Avaliacoes_Usuarios_UsuarioAvaliadorId",
                        column: x => x.UsuarioAvaliadorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Mensagens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AluguelId = table.Column<int>(type: "integer", nullable: false),
                    RemetenteId = table.Column<int>(type: "integer", nullable: false),
                    Conteudo = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    DataEnvio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Lida = table.Column<bool>(type: "boolean", nullable: false),
                    DataLeitura = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mensagens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mensagens_Alugueis_AluguelId",
                        column: x => x.AluguelId,
                        principalTable: "Alugueis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mensagens_Usuarios_RemetenteId",
                        column: x => x.RemetenteId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Transacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AluguelId = table.Column<int>(type: "integer", nullable: false),
                    ValorPago = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MercadoPagoId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    MercadoPagoPaymentId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    MetodoPagamento = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DetalhesResposta = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transacoes_Alugueis_AluguelId",
                        column: x => x.AluguelId,
                        principalTable: "Alugueis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alugueis_DataInicio_DataFim",
                table: "Alugueis",
                columns: new[] { "DataInicio", "DataFim" });

            migrationBuilder.CreateIndex(
                name: "IX_Alugueis_EquipamentoId",
                table: "Alugueis",
                column: "EquipamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Alugueis_LocatarioId",
                table: "Alugueis",
                column: "LocatarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Alugueis_Status",
                table: "Alugueis",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_AluguelId",
                table: "Avaliacoes",
                column: "AluguelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_EquipamentoId",
                table: "Avaliacoes",
                column: "EquipamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_UsuarioAvaliadoId",
                table: "Avaliacoes",
                column: "UsuarioAvaliadoId");

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_UsuarioAvaliadorId",
                table: "Avaliacoes",
                column: "UsuarioAvaliadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipamentos_Categoria",
                table: "Equipamentos",
                column: "Categoria");

            migrationBuilder.CreateIndex(
                name: "IX_Equipamentos_Cidade_UF",
                table: "Equipamentos",
                columns: new[] { "Cidade", "UF" });

            migrationBuilder.CreateIndex(
                name: "IX_Equipamentos_UsuarioId",
                table: "Equipamentos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensagens_AluguelId",
                table: "Mensagens",
                column: "AluguelId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensagens_DataEnvio",
                table: "Mensagens",
                column: "DataEnvio");

            migrationBuilder.CreateIndex(
                name: "IX_Mensagens_RemetenteId",
                table: "Mensagens",
                column: "RemetenteId");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_AluguelId",
                table: "Transacoes",
                column: "AluguelId");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_MercadoPagoId",
                table: "Transacoes",
                column: "MercadoPagoId");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_Status",
                table: "Transacoes",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Avaliacoes");

            migrationBuilder.DropTable(
                name: "Mensagens");

            migrationBuilder.DropTable(
                name: "Transacoes");

            migrationBuilder.DropTable(
                name: "Alugueis");

            migrationBuilder.DropTable(
                name: "Equipamentos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
