namespace AluguelEquipamentosApi.Services;

public interface IStorageService
{
    Task<string> ConvertToBase64Async(IFormFile file);
    Task<List<string>> ConvertToBase64Async(List<IFormFile> files);
    bool ValidateImage(IFormFile file);
}
