// main.js
document.addEventListener('DOMContentLoaded', function () {
  // Máscara CPF, Telefone, CEP - implementações simples
  function setInputFilter(el, filter) {
    el.addEventListener('input', function () {
      if (filter(this.value)) {
        this.oldValue = this.value;
      } else if (this.hasOwnProperty('oldValue')) {
        this.value = this.oldValue;
      } else {
        this.value = '';
      }
    });
  }

  // CPF mask
  const cpf = document.getElementById('cpf');
  if (cpf) {
    cpf.addEventListener('input', function () {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      v = v.replace(/^(\d{3})(\d)/, '$1.$2');
      v = v.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      this.value = v;
    });
  }

  // Telefone mask
  const tel = document.getElementById('telefone');
  if (tel) {
    tel.addEventListener('input', function () {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      v = v.replace(/^(\d{2})(\d)/g,'($1) $2');
      v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
      this.value = v;
    });
  }

  // CEP mask + optional fetch via viacep (CORS depends on host). This is graceful: if fetch falhar, ignora.
  const cep = document.getElementById('cep');
  if (cep) {
    cep.addEventListener('input', function () {
      let v = this.value.replace(/\D/g,'').slice(0,8);
      if (v.length >= 6) v = v.replace(/^(\d{5})(\d)/, '$1-$2');
      this.value = v;
    });

    cep.addEventListener('blur', function () {
      const val = this.value.replace(/\D/g,'');
      if (val.length === 8) {
        // tenta buscar endereço via ViaCEP (opcional — requer conexão externa)
        fetch('https://viacep.com.br/ws/' + val + '/json/')
          .then(resp => resp.json())
          .then(data => {
            if (!data.erro) {
              const end = document.getElementById('endereco');
              const cidade = document.getElementById('cidade');
              const estado = document.getElementById('estado');
              if (end && data.logradouro) end.value = data.logradouro + (data.complemento ? ' ' + data.complemento : '');
              if (cidade && data.localidade) cidade.value = data.localidade;
              if (estado && data.uf) estado.value = data.uf;
            }
          })
          .catch(()=>{/* fail silently, keeps UX friendly */});
      }
    });
  }

  // Exemplo de submissão com validação nativa e mensagem
  const form = document.getElementById('formCadastro');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        // permite que o navegador mostre mensagens nativas
        // adiciona foco no primeiro campo inválido
        e.preventDefault();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
      } else {
        e.preventDefault(); // demo: evitar envio real
        const msg = document.getElementById('formMsg');
        msg.style.display = 'block';
        msg.textContent = 'Cadastro recebido! (esta é uma simulação — integre com backend para persistir.)';
      }
    });
  }
});
