namespace AluguelEquipamentosApi.DTOs.Responses;

public class TransacaoResponse
{
    public int Id { get; set; }
    public int AluguelId { get; set; }
    public decimal ValorPago { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? MercadoPagoId { get; set; }
    public string? MercadoPagoPaymentId { get; set; }
    public string? MetodoPagamento { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime? DataAtualizacao { get; set; }
}
