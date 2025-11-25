# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["AluguelEquipamentosApi.csproj", "./"]
RUN dotnet restore "AluguelEquipamentosApi.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "AluguelEquipamentosApi.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "AluguelEquipamentosApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create directories for uploads and logs
RUN mkdir -p /app/wwwroot/uploads /app/logs

EXPOSE 80
EXPOSE 443

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "AluguelEquipamentosApi.dll"]
