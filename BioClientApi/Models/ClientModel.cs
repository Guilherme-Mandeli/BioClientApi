using System.ComponentModel.DataAnnotations;

namespace BioClientApi.Models
{
    public class ClientModel
    {
        public int Id { get; set; }
        public string? Nome { get; set; }

        [Required(ErrorMessage = "O campo E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Insira um endereço de e-mail válido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O campo CPF é obrigatório.")]
        public string CPF { get; set; }

        [Required(ErrorMessage = "O campo RG é obrigatório.")]
        public string RG { get; set; }
        public List<ContactModel> Contatos { get; set; }
        public List<AddressModel> Enderecos { get; set; }
    }

    public class ContactModel
    {
        public int Id { get; set; }
        public string? Tipo { get; set; }
        public int? DDD { get; set; }
        public long? Telefone { get; set; }
    }

    public class AddressModel
    {
        public int Id { get; set; }
        public string? Tipo { get; set; }

        [Required(ErrorMessage = "O campo CEP é obrigatório.")]
        public string CEP { get; set; }
        public string? Logradouro { get; set; }
        public int? Numero { get; set; }
        public string? Bairro { get; set; }
        public string? Complemento { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public string? Referencia { get; set; }
    }
}
