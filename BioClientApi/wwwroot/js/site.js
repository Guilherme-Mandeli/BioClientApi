var numbersCount = $("#contactNumbers").children().length - 1;
var addressCount = $("#contactAddress").children().length - 1;
function addContactNumber() {
    numbersCount++;

    let newNumber = `
        <div id="contact-number-${numbersCount}" class="mt-3 border-top pt-1">
            <div class="row">
                <div class="col-10">
                    <select name="Contatos[${numbersCount}].Tipo" class="form-select my-2 col-5" aria-label="Selecionar...">
                        <option value="Residencial" selected>Residencial</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Celular">Celular</option>
                    </select>
                </div>
                <div class="col-2 p-0 d-flex align-items-center">
                    <button type="button" onclick="removeContactNumber(${numbersCount})" class="btn btn-danger" style="width: 80%;">X</button>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-3">
                    <input name="Contatos[${numbersCount}].DDD" type="text" class="form-control dddInput" placeholder="DDD" />
                </div>
                <div class="col-9">
                    <input name="Contatos[${numbersCount}].Telefone" type="text"class="form-control phoneInput" placeholder="Número" />
                </div>
            </div>
        </div>
    `;

    $("#contactNumbers").append(newNumber);
}

function removeContactNumber( index ) {
    $(`#contact-number-${index}`).remove();
}

function addContactAddress() {
    addressCount++;

    let newAddress = `
            <div id="contact-address-${addressCount}" class="d-flex flex-row flex-wrap gap-5 mt-3 border-top pt-3">
                <div class="w-100 d-flex flex-column align-items-center" style="max-width: 380px;">
                    <select name="Enderecos[${addressCount}].Tipo" class="form-select m-2" aria-label="Selecionar...">
                        <option value="Preferencial" selected>Preferencial</option>
                        <option value="Entreag">Entrega</option>
                        <option value="Cobrança">Cobrança</option>
                    </select>
                    <input name="Enderecos[${addressCount}].Estado" class="form-control m-2" placeholder="Estado" />
                    <input name="Enderecos[${addressCount}].CEP" class="form-control cepInputs m-2" placeholder="CEP" />
                    <input name="Enderecos[${addressCount}].Cidade" class="form-control m-2" placeholder="Cidade" />       
                </div>
                <div class="w-100 d-flex flex-column align-items-center" style="max-width: 380px;">
                    <input name="Enderecos[${addressCount}].Bairro" class="form-control m-2" placeholder="Bairro" />
                    <input name="Enderecos[${addressCount}].Logradouro" class="form-control m-2" placeholder="Rua" />
                    <input name="Enderecos[${addressCount}].Numero" type="text" class="form-control numberAddressInput m-2" placeholder="Número" />
                    <input name="Enderecos[${addressCount}].Complemento" class="form-control m-2" placeholder="Complemento" />
                </div>
                <div class="w-100 d-flex flex-column align-items-center" style="max-width: 380px;">
                    <textarea name="Enderecos[${addressCount}].Referencia" class="form-control m-2" placeholder="Referencia"></textarea>
                    <div class="w-100 p-0 d-flex align-items-center mt-1">
                        <button type="button" onclick="removeContactAddress(${addressCount})" class="btn btn-danger mt-1">Remover endereço</button>
                    </div>
                </div>
            </div>
        `;

    $("#contactAddress").append(newAddress);
}
function removeContactAddress(index) {
    $(`#contact-address-${index}`).remove();
}

$('#createNewUserForm').submit(function (event) {
    event.preventDefault();

    var numbersAddedCount = $("#contactNumbers").children().length - 1;
    var addressAddedCount = $("#contactAddress").children().length - 1;

    let formData = {
        Nome: $("input[name='Nome']").val(),
        Email: $("input[name='Email']").val(),
        CPF: $("input[name='CPF']").val().replace(/\D/g, ''),
        RG: $("input[name='RG']").val().replace(/\D/g, ''),
        Contatos: [],
        Enderecos: []
    };

    // Processar os contatos
    for (let i = 0; i <= numbersAddedCount; i++) {
        formData.Contatos.push({
            Id: i,
            Tipo: $(`select[name="Contatos[${i}].Tipo"]`).val(),
            DDD: $(`input[name="Contatos[${i}].DDD"]`).val(),
            Telefone: $(`input[name="Contatos[${i}].Telefone"]`).val().replace(/\D/g, '')
        });
    }

    
    // Processar os endereços
    for (let i = 0; i <= addressAddedCount; i++) {
        formData.Enderecos.push({
            Id: i,
            Tipo: $(`select[name="Enderecos[${i}].Tipo"]`).val(),
            Estado: $(`input[name="Enderecos[${i}].Estado"]`).val(),
            CEP: $(`input[name="Enderecos[${i}].CEP"]`).val().replace(/\D/g, ''),
            Cidade: $(`input[name="Enderecos[${i}].Cidade"]`).val(),
            Bairro: $(`input[name="Enderecos[${i}].Bairro"]`).val(),
            Logradouro: $(`input[name="Enderecos[${i}].Logradouro"]`).val(),
            Numero: $(`input[name="Enderecos[${i}].Numero"]`).val(),
            Complemento: $(`input[name="Enderecos[${i}].Complemento"]`).val(),
            Referencia: $(`textarea[name="Enderecos[${i}].Referencia"]`).val()
        });
    }

    // Envia os dados para o controlador via AJAX
    $.ajax({
        type: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
            if (response.success) {
                window.location.href = "/cliente/listar";
            } else {
                $(".text-danger").empty();

                $.each(response.errors, function (index, error) {
                    $(`span[data-valmsg-for="${error.key}"]`).text(error.errorMessage);
                });
            }
        }
    })
});

// Seria legal modularizar estes dois submits, mas sem tempo irmão ksks
$('#updateUserForm').submit(function (event) {
    event.preventDefault();

    var numbersAddedCount = $("#contactNumbers").children().length - 1;
    var addressAddedCount = $("#contactAddress").children().length - 1;

    let formData = {
        Nome: $("input[name='Nome']").val(),
        Email: $("input[name='Email']").val(),
        CPF: $("input[name='CPF']").val().replace(/\D/g, ''),
        RG: $("input[name='RG']").val().replace(/\D/g, ''),
        Contatos: [],
        Enderecos: []
    };

    // Processar os contatos
    for (let i = 0; i <= numbersAddedCount; i++) {
        formData.Contatos.push({
            Id: i,
            Tipo: $(`select[name="Contatos[${i}].Tipo"]`).val(),
            DDD: $(`input[name="Contatos[${i}].DDD"]`).val(),
            Telefone: $(`input[name="Contatos[${i}].Telefone"]`).val().replace(/\D/g, '')
        });
    }


    // Processar os endereços
    for (let i = 0; i <= addressAddedCount; i++) {
        formData.Enderecos.push({
            Id: i,
            Tipo: $(`select[name="Enderecos[${i}].Tipo"]`).val(),
            Estado: $(`input[name="Enderecos[${i}].Estado"]`).val(),
            CEP: $(`input[name="Enderecos[${i}].CEP"]`).val(),
            Cidade: $(`input[name="Enderecos[${i}].Cidade"]`).val(),
            Bairro: $(`input[name="Enderecos[${i}].Bairro"]`).val(),
            Logradouro: $(`input[name="Enderecos[${i}].Logradouro"]`).val(),
            Numero: $(`input[name="Enderecos[${i}].Numero"]`).val(),
            Complemento: $(`input[name="Enderecos[${i}].Complemento"]`).val(),
            Referencia: $(`textarea[name="Enderecos[${i}].Referencia"]`).val()
        });
    }

    // Envia os dados para o controlador via AJAX
    $.ajax({
        type: "POST",
        data: formData,
        dataType: "json",
        success: function (response) {
            if (response.success) {
                window.location.href = "/cliente/listar";
            } else {
                $(".text-danger").empty();

                $.each(response.errors, function (index, error) {
                    $(`span[data-valmsg-for="${error.key}"]`).text(error.errorMessage);
                });
            }
        }
    })
});

const applyFilters = (function () {

    // Métodos
    function maskCpf(el) {
        var sanitizedValue = el.value.replace(/\D/g, '');

        sanitizedValue = sanitizedValue.slice(0, 11);

        // Aplica a máscara XXX.XXX.XXX-XX
        if (sanitizedValue.length <= 3) {
            sanitizedValue = sanitizedValue.replace(/(\d{3})/, '$1');
        } else if (sanitizedValue.length <= 6) {
            sanitizedValue = sanitizedValue.replace(/(\d{3})(\d{3})/, '$1.$2');
        } else if (sanitizedValue.length <= 9) {
            sanitizedValue = sanitizedValue.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else {
            sanitizedValue = sanitizedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }

        el.value = sanitizedValue;
    }

    function maskRg(el) {
        var sanitizedValue = el.value.replace(/\D/g, '');

        sanitizedValue = sanitizedValue.slice(0, 9);

        // Aplica a máscara XX.XXX.XXX-X
        if (sanitizedValue.length <= 1) {
            sanitizedValue = sanitizedValue.replace(/(\d{2})/, '$1');
        } else if (sanitizedValue.length <= 4) {
            sanitizedValue = sanitizedValue.replace(/(\d{2})(\d{3})/, '$1.$2');
        } else if (sanitizedValue.length <= 8) {
            sanitizedValue = sanitizedValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
        } else {
            sanitizedValue = sanitizedValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3-');
        }

        el.value = sanitizedValue;
    }

    function maskDdd(el) {
        let sanitizedValue = $(el).val().replace(/\D/g, '');

        sanitizedValue = sanitizedValue.slice(0, 2);

        $(el).val(sanitizedValue);
    }

    // Máscara para número de Telefone ou Celular
    function maskPhone(el) {
        var sanitizedValue = $(el).val().replace(/\D/g, '');

        sanitizedValue = sanitizedValue.slice(0, 9);

        // Aplica a máscara XXXX-XXXX ou XXXXX-XXXX
        if (sanitizedValue.length <= 8) {
            sanitizedValue = sanitizedValue.replace(/(\d{4})/, '$1-');
        } else {
            sanitizedValue = sanitizedValue.replace(/(\d{5})(\d{4})/, '$1-$2');
        }

        $(el).val(sanitizedValue);
    }

    // Máscara para Número de endereço
    function maskCep(el) {
        let sanitizedValue = $(el).val().replace(/\D/g, '');

        sanitizedValue = sanitizedValue.slice(0, 8);

        // Aplica a máscara XXXXX-XXX
        if (sanitizedValue.length <= 5) {
             sanitizedValue = sanitizedValue.replace(/(\d{5})/, '$1');
        } else {
             sanitizedValue = sanitizedValue.replace(/(\d{5})(\d{3})/, '$1-$2');
        }

        $(el).val(sanitizedValue);
    }

    // Máscara para Número de endereço
    function maskNumberAddress(el) {
        let sanitizedValue = $(el).val().replace(/\D/g, '');

        $(el).val(sanitizedValue);
    }

    // Retorno de API Pública
    return {
        maskCpf,
        maskRg,
        maskDdd,
        maskPhone,
        maskCep,
        maskNumberAddress
    }

})();

// Dados 
let createClientForm = document.getElementById("createNewUserForm");
let updateClientForm = document.getElementById("updateUserForm")

let cpfInput = document.getElementById('cpfInput');
let rgInput = document.getElementById('rgInput');
let dddInputs = document.getElementsByClassName('dddInput');
let phoneInputs = document.getElementsByClassName('phoneInput');
let cepInputs = document.getElementsByClassName('cepInputs');
let numberAddressInputs = document.getElementsByClassName('numberAddressInput');


if (createClientForm || updateClientForm) {
    // Máscara para CPF
    cpfInput.addEventListener('input', function () {
        applyFilters.maskCpf(this);
    });

    applyFilters.maskCpf(cpfInput);

    // Máscara para RG
    rgInput.addEventListener('input', function () {
        applyFilters.maskRg(this);
    });

    applyFilters.maskRg(rgInput);


    // Máscara para DDD
    $(document).on('input', '.dddInput', function () {
        applyFilters.maskDdd(this);
    });

    applyFilters.maskDdd($(".dddInput"));

    // Máscara para Telefone
    $(document).on('input', '.phoneInput', function () {
        applyFilters.maskPhone(this);
    });

    applyFilters.maskPhone($(".phoneInput"));

    // Máscara para CEP(S)
    $(document).on('input', '.cepInputs', function () {
        applyFilters.maskCep(this);
    });

    applyFilters.maskCep($(".cepInputs"));
    

    // Máscara para Número de Endereço
    $(document).on('input', '.numberAddressInput', function () {
        applyFilters.maskNumberAddress(this);
    });

    applyFilters.maskNumberAddress($(".numberAddressInput"));
}