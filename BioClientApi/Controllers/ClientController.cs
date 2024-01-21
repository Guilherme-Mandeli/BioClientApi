using BioClientApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net;
using System.Text.Json;

namespace BioClientApi.Controllers
{
    public class clienteController : Controller
    {

        private List<ClientModel> clients;

        public IActionResult listar(string filtroNome, string filtroEmail, string filtroCPF)
        {

            string jsonFilePath = Path.Combine("Data", "clients.json");
            string jsonData = System.IO.File.ReadAllText(jsonFilePath);

            clients = JsonSerializer.Deserialize<List<ClientModel>>(jsonData);

            // Aplicar filtros
            if (!string.IsNullOrEmpty(filtroNome))
            {
                clients = clients.Where(c => c.Nome != null && c.Nome.Contains(filtroNome, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrEmpty(filtroEmail))
            {
                clients = clients.Where(c => c.Email.Contains(filtroEmail, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrEmpty(filtroCPF))
            {
                clients = clients.Where(c => c.CPF.Contains(filtroCPF, StringComparison.OrdinalIgnoreCase)).ToList();
            }


            return View(clients);
        }

        public IActionResult criar()
        {
            return View();
        }
        
        [HttpPost]
        public IActionResult criar(ClientModel newClient)
        {
            if (string.IsNullOrWhiteSpace(newClient.Email))
            {
                ModelState.AddModelError("Email", "O campo E-mail é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(newClient.CPF))
            {
                ModelState.AddModelError("CPF", "O campo CPF é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(newClient.RG))
            {
                ModelState.AddModelError("RG", "O campo RG é obrigatório.");
            }

            // Validar pelo menos um endereço com CEP
            if (newClient.Enderecos == null || !newClient.Enderecos.Any(e => !string.IsNullOrWhiteSpace(e.CEP)))
            {
                ModelState.AddModelError("Enderecos[0].CEP", "É necessário fornecer pelo menos um endereço com CEP.");
            }

            if (ModelState.IsValid)
            {
                // Novo ID
                int clientsLength = GetClientsLength();
                int newId = clientsLength + 1;

                // Atribui o novo ID ao cliente
                newClient.Id = newId;

                // Lê os clientes existentes do arquivo JSON
                string jsonFilePath = Path.Combine("Data", "clients.json");
                string jsonData = System.IO.File.ReadAllText(jsonFilePath);
                clients = JsonSerializer.Deserialize<List<ClientModel>>(jsonData);

                // Adiciona o novo cliente ao JSON
                clients.Add(newClient);
                string novoJsonData = JsonSerializer.Serialize(clients);
                System.IO.File.WriteAllText(jsonFilePath, novoJsonData);

                return Json(new { success = true });
            }
            else
            {
                var errors = ModelState.Keys
                .SelectMany(key => ModelState[key].Errors.Select(error => new { key, error.ErrorMessage }))
                .ToList();

                return Json(new { success = false, errors });
            }
        }

        public IActionResult atualizar(int id)
        {
            LoadClients();

            ClientModel client = clients.FirstOrDefault(c => c.Id == id);

            if (client == null)
            {
                return RedirectToAction("listar");
            }

            return View(client);
        }

        [HttpPost]
        public IActionResult atualizar(ClientModel client)
        {  
            LoadClients();

            var selectedClient = clients.FirstOrDefault(c => c.Id == client.Id);

            if (string.IsNullOrWhiteSpace(selectedClient.Email))
            {
                ModelState.AddModelError("Email", "O campo E-mail é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(selectedClient.CPF))
            {
                ModelState.AddModelError("CPF", "O campo CPF é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(selectedClient.RG))
            {
                ModelState.AddModelError("RG", "O campo RG é obrigatório.");
            }

            // Validar pelo menos um endereço com CEP
            if (selectedClient.Enderecos == null || !selectedClient.Enderecos.Any(e => !string.IsNullOrWhiteSpace(e.CEP)))
            {
                ModelState.AddModelError("Enderecos[0].CEP", "É necessário fornecer pelo menos um endereço com CEP.");
            }

            if (ModelState.IsValid && selectedClient != null)
            {
                // Atualizar Informacoes
                selectedClient.Nome = client.Nome;
                selectedClient.Email = client.Email;
                selectedClient.CPF = client.CPF;
                selectedClient.RG = client.RG;

                // Atualizar Contato
                UpdateContacts(client.Contatos, selectedClient.Contatos);

                // Atualizar Endereco
                UpdateAddresses(client.Enderecos, selectedClient.Enderecos);

                // Salvar no JSON
                string jsonFilePath = Path.Combine("Data", "clients.json");
                string novoJsonData = JsonSerializer.Serialize(clients);
                System.IO.File.WriteAllText(jsonFilePath, novoJsonData);

                return Json(new { success = true });
            }
            else
            {
                var errors = ModelState.Keys
                .SelectMany(key => ModelState[key].Errors.Select(error => new { key, error.ErrorMessage }))
                .ToList();

                return Json(new { success = false, errors });
            }
        }

        public IActionResult confirmarRemover(int id)
        {
            LoadClients();

            ClientModel client = clients.FirstOrDefault(c => c.Id == id);

            // Retornar se ID não existe
            if (client == null)
            {
                return RedirectToAction("listar");
            }

            return View(client);
        }

        public IActionResult remover(int id)
        {
            // Buscar o cliente pelo ID
            LoadClients();
            ClientModel client = clients.FirstOrDefault(c => c.Id == id);

            if (client != null)
            {
                // Remover o cliente da lista
                clients.Remove(client);

                // Atualizar o arquivo JSON
                string jsonFilePath = Path.Combine("Data", "clients.json");
                string novoJsonData = JsonSerializer.Serialize(clients);
                System.IO.File.WriteAllText(jsonFilePath, novoJsonData);
            }

            // Redirecionar de volta para a lista
            return RedirectToAction("listar");
        }

        private void LoadClients()
        {
            if (clients == null)
            {
                string jsonFilePath = Path.Combine("Data", "clients.json");
                string jsonData = System.IO.File.ReadAllText(jsonFilePath);
                clients = JsonSerializer.Deserialize<List<ClientModel>>(jsonData);
            }
        }

        private int GetClientsLength()
        {
            // Lê os clientes existentes do arquivo JSON
            string jsonFilePath = Path.Combine("Data", "clients.json");
            string jsonData = System.IO.File.ReadAllText(jsonFilePath);
            clients = JsonSerializer.Deserialize<List<ClientModel>>(jsonData);

            int clientsLength = clients.Count;

            return clientsLength;
        }

        private void UpdateContacts(List<ContactModel> sourceContacts, List<ContactModel> targetContacts)
        {
            foreach (var sourceContact in sourceContacts.ToList())
            {
                var targetContact = targetContacts.FirstOrDefault(c => c.Id == sourceContact.Id);

                if (targetContact != null)
                {
                    // Atualizar Contato
                    targetContact.Tipo = sourceContact.Tipo;
                    targetContact.DDD = sourceContact.DDD;
                    targetContact.Telefone = sourceContact.Telefone;
                }
                else
                {
                    // Adicionar Contato
                    targetContacts.Add(sourceContact);
                }
            }

            // Remover Contatos
            targetContacts.RemoveAll(tc => sourceContacts.All(sc => sc.Id != tc.Id));
        }

        private void UpdateAddresses(List<AddressModel> sourceAddresses, List<AddressModel> targetAddresses)
        {
            foreach (var sourceAddress in sourceAddresses)
            {
                var targetAddress = targetAddresses.FirstOrDefault(a => a.Id == sourceAddress.Id);

                if (targetAddress != null)
                {
                    // Atualizar Endereco
                    targetAddress.Tipo = sourceAddress.Tipo;
                    targetAddress.CEP = sourceAddress.CEP;
                    targetAddress.Logradouro = sourceAddress.Logradouro;
                    targetAddress.Numero = sourceAddress.Numero;
                    targetAddress.Bairro = sourceAddress.Bairro;
                    targetAddress.Complemento = sourceAddress.Complemento;
                    targetAddress.Cidade = sourceAddress.Cidade;
                    targetAddress.Estado = sourceAddress.Estado;
                    targetAddress.Referencia = sourceAddress.Referencia;
                }
                else
                {
                    // Adicionar Endereco
                    targetAddresses.Add(sourceAddress);
                }
            }

            // Remover Enderecos
            targetAddresses.RemoveAll(a => sourceAddresses.All(sa => sa.Id != a.Id));
        }
    }
}
