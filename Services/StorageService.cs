namespace AluguelEquipamentosApi.Services;

public class StorageService : IStorageService
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<StorageService> _logger;

    public StorageService(IConfiguration configuration, IWebHostEnvironment environment, ILogger<StorageService> logger)
    {
        _configuration = configuration;
        _environment = environment;
        _logger = logger;
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder)
    {
        try
        {
            // Validar arquivo
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

            // Gerar nome único para o arquivo
            var fileName = $"{Guid.NewGuid()}{extension}";
            
            // Obter tipo de storage da configuração
            var storageType = _configuration["Storage:Type"] ?? "Local";

            if (storageType == "Azure")
            {
                // TODO: Implementar upload para Azure Blob Storage
                throw new NotImplementedException("Azure Blob Storage ainda não implementado");
            }
            else
            {
                // Upload local
                var localPath = _configuration["Storage:LocalPath"] ?? "wwwroot/uploads";
                var uploadPath = Path.Combine(_environment.ContentRootPath, localPath, folder);

                // Criar diretório se não existir
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                var filePath = Path.Combine(uploadPath, fileName);

                // Salvar arquivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar URL relativa
                return $"/uploads/{folder}/{fileName}";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fazer upload de imagem");
            throw;
        }
    }

    public async Task<List<string>> UploadImagesAsync(List<IFormFile> files, string folder)
    {
        var uploadedUrls = new List<string>();

        foreach (var file in files)
        {
            try
            {
                var url = await UploadImageAsync(file, folder);
                uploadedUrls.Add(url);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao fazer upload da imagem {file.FileName}");
                // Continuar com os próximos arquivos
            }
        }

        return uploadedUrls;
    }

    public async Task<bool> DeleteImageAsync(string imageUrl)
    {
        try
        {
            if (string.IsNullOrEmpty(imageUrl))
            {
                return false;
            }

            var storageType = _configuration["Storage:Type"] ?? "Local";

            if (storageType == "Azure")
            {
                // TODO: Implementar exclusão do Azure Blob Storage
                throw new NotImplementedException("Azure Blob Storage ainda não implementado");
            }
            else
            {
                // Exclusão local
                var localPath = _configuration["Storage:LocalPath"] ?? "wwwroot/uploads";
                var filePath = Path.Combine(_environment.ContentRootPath, localPath, imageUrl.TrimStart('/').Replace("uploads/", ""));

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }

                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao deletar imagem {imageUrl}");
            return false;
        }
    }

    public async Task<bool> DeleteImagesAsync(List<string> imageUrls)
    {
        var allDeleted = true;

        foreach (var imageUrl in imageUrls)
        {
            var deleted = await DeleteImageAsync(imageUrl);
            if (!deleted)
            {
                allDeleted = false;
            }
        }

        return allDeleted;
    }
}
