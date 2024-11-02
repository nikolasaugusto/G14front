const materiaList = document.getElementById('materia-list');
const saveMateriaBtn = document.getElementById('saveMateriaBtn');
const deleteMateriaBtn = document.getElementById('deleteMateriaBtn');
const addAtividadeBtn = document.getElementById('addAtividadeBtn');
const saveAtividadeBtn = document.getElementById('saveAtividadeBtn');
let currentMateriaId = null; // ID da matéria atual
let currentNotaId = null; // ID da nota atual

// Função para carregar matérias e suas notas do banco de dados
async function loadMaterias() {
    try {
        const response = await fetch('http://localhost:5287/api/Disciplinas');
        const materias = await response.json();
        renderMaterias(materias);
    } catch (error) {
        console.error('Erro ao carregar matérias:', error);
    }
}

// Função para renderizar matérias e notas
function renderMaterias(materias) {
    materiaList.innerHTML = ''; // Limpar a lista antes de renderizar
    materias.forEach((materia) => {
        const newItem = document.createElement('li');
        newItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
        newItem.innerHTML = `<span class="materia-nome">${materia.nome}</span>
                             <button class="btn" onclick="editMateria(${materia.id})" aria-label="Editar matéria ${materia.nome}">
                                <i class="bi bi-three-dots-vertical"></i>
                             </button>`;
        materiaList.appendChild(newItem);
    });
}

// Função para salvar ou atualizar matéria
saveMateriaBtn.addEventListener('click', async () => {
    const nome = document.getElementById('materiaNome').value;
    const valor = document.getElementById('materiaValor').value;

    if (nome && valor) {
        const materia = { nome, mediaAprovacao: valor };

        try {
            if (currentMateriaId !== null) {
                await fetch(`http://localhost:5287/api/Disciplinas${currentMateriaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(materia),
                });
            } else {
                await fetch('http://localhost:5287/api/Disciplinas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(materia),
                });
            }

            loadMaterias();
            resetModal();
            const modal = bootstrap.Modal.getInstance(document.getElementById('materiaModal'));
            modal.hide();
        } catch (error) {
            console.error('Erro ao salvar matéria:', error);
        }
    }
});

// Função para excluir uma matéria
deleteMateriaBtn.addEventListener('click', async () => {
    if (currentMateriaId !== null) {
        try {
            await fetch(`http://localhost:5287/api/Disciplinas${currentMateriaId}`, { method: 'DELETE' });
            loadMaterias();
            resetModal();
            const modal = bootstrap.Modal.getInstance(document.getElementById('materiaModal'));
            modal.hide();
        } catch (error) {
            console.error('Erro ao excluir matéria:', error);
        }
    }
});

// Função para editar uma matéria
async function editMateria(id) {
    currentMateriaId = id;

    try {
        const response = await fetch(`http://localhost:5287/api/Disciplinas${id}`);
        const materia = await response.json();

        if (materia) {
            document.getElementById('materiaNome').value = materia.nome;
            document.getElementById('materiaValor').value = materia.mediaAprovacao;
            saveMateriaBtn.textContent = "Atualizar Matéria";
            deleteMateriaBtn.disabled = false;
            const modal = new bootstrap.Modal(document.getElementById('materiaModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Erro ao carregar matéria:', error);
    }
}

// Função para resetar o modal
function resetModal() {
    document.getElementById('materiaNome').value = '';
    document.getElementById('materiaValor').value = '';
    saveMateriaBtn.textContent = "Salvar Matéria";
    deleteMateriaBtn.disabled = true;
    currentMateriaId = null;
}

// Função para adicionar atividades
addAtividadeBtn.addEventListener('click', () => {
    document.getElementById('atividadeNome').value = '';
    document.getElementById('atividadeValorTotal').value = '';
    document.getElementById('atividadeValorNota').value = '';
    const modal = new bootstrap.Modal(document.getElementById('atividadeModal'));
    modal.show();
});

// Função para salvar a atividade
saveAtividadeBtn.addEventListener('click', async () => {
    const atividadeNome = document.getElementById('atividadeNome').value;
    const atividadeValorTotal = document.getElementById('atividadeValorTotal').value;
    const atividadeValorNota = document.getElementById('atividadeValorNota').value;

    if (atividadeNome && atividadeValorTotal && atividadeValorNota && currentMateriaId !== null) {
        const atividade = {
            nome: atividadeNome,
            valorTotal: atividadeValorTotal,
            valorNota: atividadeValorNota,
        };

        try {
            const response = await fetch(`http://localhost:5287/api/Tarefas`, { // Aqui o bloco de opções deve estar diretamente dentro do fetch()
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(atividade),
            });

            if (response.ok) {
                loadMaterias();
                const modal = bootstrap.Modal.getInstance(document.getElementById('atividadeModal'));
                modal.hide();
            }
        } catch (error) {
            console.error('Erro ao salvar atividade:', error);
        }

    }
});

// Carregar matérias ao iniciar
loadMaterias();
