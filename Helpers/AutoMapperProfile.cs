using AutoMapper;
using AluguelEquipamentosApi.Models;
using AluguelEquipamentosApi.DTOs.Requests;
using AluguelEquipamentosApi.DTOs.Responses;

namespace AluguelEquipamentosApi.Helpers;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Usuario Mappings
        CreateMap<RegisterRequest, Usuario>()
            .ForMember(dest => dest.SenhaHash, opt => opt.Ignore());

        CreateMap<Usuario, UsuarioResponse>()
            .ForMember(dest => dest.MediaAvaliacoes, opt => opt.MapFrom(src =>
                src.AvaliacoesRecebidas.Any() ? src.AvaliacoesRecebidas.Average(a => a.Nota) : (double?)null))
            .ForMember(dest => dest.TotalAvaliacoes, opt => opt.MapFrom(src => src.AvaliacoesRecebidas.Count));

        // Equipamento Mappings
        CreateMap<CreateEquipamentoRequest, Equipamento>();
        
        CreateMap<Equipamento, EquipamentoResponse>()
            .ForMember(dest => dest.NomeProprietario, opt => opt.MapFrom(src => src.Usuario!.Nome))
            .ForMember(dest => dest.FotoPerfilProprietario, opt => opt.MapFrom(src => src.Usuario!.FotoPerfil))
            .ForMember(dest => dest.MediaAvaliacoes, opt => opt.MapFrom(src =>
                src.Avaliacoes.Any() ? src.Avaliacoes.Average(a => a.Nota) : (double?)null))
            .ForMember(dest => dest.TotalAvaliacoes, opt => opt.MapFrom(src => src.Avaliacoes.Count));

        // Aluguel Mappings
        CreateMap<CreateAluguelRequest, Aluguel>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pendente"));

        CreateMap<Aluguel, AluguelResponse>()
            .ForMember(dest => dest.TituloEquipamento, opt => opt.MapFrom(src => src.Equipamento!.Titulo))
            .ForMember(dest => dest.ImagensEquipamento, opt => opt.MapFrom(src => src.Equipamento!.Imagens))
            .ForMember(dest => dest.NomeLocatario, opt => opt.MapFrom(src => src.Locatario!.Nome))
            .ForMember(dest => dest.FotoPerfilLocatario, opt => opt.MapFrom(src => src.Locatario!.FotoPerfil))
            .ForMember(dest => dest.ProprietarioId, opt => opt.MapFrom(src => src.Equipamento!.UsuarioId))
            .ForMember(dest => dest.NomeProprietario, opt => opt.MapFrom(src => src.Equipamento!.Usuario!.Nome))
            .ForMember(dest => dest.FotoPerfilProprietario, opt => opt.MapFrom(src => src.Equipamento!.Usuario!.FotoPerfil))
            .ForMember(dest => dest.PodeAvaliar, opt => opt.MapFrom(src => 
                src.Status == "Concluido" && src.Avaliacao == null))
            .ForMember(dest => dest.JaAvaliado, opt => opt.MapFrom(src => src.Avaliacao != null));

        // Avaliacao Mappings
        CreateMap<CreateAvaliacaoRequest, Avaliacao>();

        CreateMap<Avaliacao, AvaliacaoResponse>()
            .ForMember(dest => dest.NomeAvaliador, opt => opt.MapFrom(src => src.UsuarioAvaliador!.Nome))
            .ForMember(dest => dest.FotoPerfilAvaliador, opt => opt.MapFrom(src => src.UsuarioAvaliador!.FotoPerfil))
            .ForMember(dest => dest.NomeAvaliado, opt => opt.MapFrom(src => src.UsuarioAvaliado!.Nome));

        // Mensagem Mappings
        CreateMap<SendMensagemRequest, Mensagem>();

        CreateMap<Mensagem, MensagemResponse>()
            .ForMember(dest => dest.NomeRemetente, opt => opt.MapFrom(src => src.Remetente!.Nome))
            .ForMember(dest => dest.FotoPerfilRemetente, opt => opt.MapFrom(src => src.Remetente!.FotoPerfil));

        // Transacao Mappings
        CreateMap<Transacao, TransacaoResponse>();
    }
}
