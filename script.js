//Elementos do formulário de cadastro
    const form = document.getElementById('useForm');
    const statusEl = document.getElementById('status');
    const cepInput = document.getElementById('cep');
    const addressMap = {
        logradouro: 'logradouro',
        bairro:     'bairro',
        localidade: 'cidade',
        uf:         'estado'
    };

    //Carrega dados do localStorage assim que abre a página
    window.addEventListener('DOMContentLoaded', () => {
        const saved = JSON.parse(localStorage.getItem('useForm')) || {};
        Object.entries(saved).forEach(([key, value]) => {
            const field = document.getElementById(key);
            if (field) field.value = value;
        });
    });

    //Salva no localStorage sempre que aalgo muda
    form.addEventListener('input', () => {
        const data = Object.fromEntries(new FormData(form));
        localStorage.setItem('useForm', JSON.stringify(data));
    });

    //Buscador de endereço no ViaCep quando o cep fica commpleto
    cepInput.addEventListener('input', async (e) => {
        const cep = e.target.value.replace(/\D/g,'');
        if (cep.lenght !== 8) return;

        try {
            statusEl.textContent = ('Buscando CEP...');
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!resp.ok) throw new Error('Falha na requisição');

            const data = await resp.json();
            if (data.erro) throw new Error('CEP não encontrado');

            //Campos preenchidos
            Object.entries(addressMap).forEach(([viaKey, formId]) => {
                const field = document.getElementById(formId);
                if (field && data[viaKey]) field.value = data[viaKey];
            });

            statusEl.textContent = 'Endereço preenchido!';
        } catch (err) {
            statusEl.textContent = `${err.message}`;
        }
    });

    //Exemplo de tratamento de envio
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        statusEl.textContent = 'Dados salvos!';
    });