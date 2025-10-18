namespace AluguelEquipamentosApi.Services;

public interface IStorageService
{
    Task<string> UploadImageAsync(IFormFile file, string folder);
    Task<List<string>> UploadImagesAsync(List<IFormFile> files, string folder);
    Task<bool> DeleteImageAsync(string imageUrl);
    Task<bool> DeleteImagesAsync(List<string> imageUrls);
}
