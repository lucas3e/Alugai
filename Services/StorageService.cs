namespace AluguelEquipamentosApi.Services;

public class StorageService : IStorageService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<StorageService> _logger;

    public StorageService(IConfiguration configuration, ILogger<StorageService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public bool ValidateImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Arquivo inválido");
        }

        // Validar tipo de arquivo
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
        {
            throw new ArgumentException("Tipo de arquivo não permitido. Use: jpg, jpeg, png, gif ou webp");
        }

        // Validar tamanho (máximo 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            throw new ArgumentException("Arquivo muito grande. Tamanho máximo: 5MB");
        }

        return true;
    }

    public async Task<string> ConvertToBase64Async(IFormFile file)
    {
        try
        {
            // Validar arquivo
            ValidateImage(file);

            // Determinar o tipo MIME
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var mimeType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "image/jpeg"
            };

            // Converter para Base64
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                var imageBytes = memoryStream.ToArray();
                var base64String = Convert.ToBase64String(imageBytes);
                
                // Retornar com prefixo data URL
                return $"data:{mimeType};base64,{base64String}";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao converter imagem para Base64");
            throw;
        }
    }

    public async Task<List<string>> ConvertToBase64Async(List<IFormFile> files)
    {
        var base64Images = new List<string>();

        foreach (var file in files)
        {
            try
            {
                var base64 = await ConvertToBase64Async(file);
                base64Images.Add(base64);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao converter imagem {file.FileName} para Base64");
                // Continuar com os próximos arquivos
            }
        }

        return base64Images;
    }
}
