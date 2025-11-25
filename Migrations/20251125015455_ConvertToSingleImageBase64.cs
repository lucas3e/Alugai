using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AluguelEquipamentosApi.Migrations
{
    /// <inheritdoc />
    public partial class ConvertToSingleImageBase64 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Imagens",
                table: "Equipamentos");

            migrationBuilder.AddColumn<string>(
                name: "Imagem",
                table: "Equipamentos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Imagem",
                table: "Equipamentos");

            migrationBuilder.AddColumn<string>(
                name: "Imagens",
                table: "Equipamentos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
