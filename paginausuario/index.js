document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos HTML
const disciplinaList = document.getElementById('materia-list'); // Verifique se o ID está correto
const saveDisciplinaBtn = document.getElementById('saveDisciplinaBtn');
const deleteDisciplinaBtn = document.getElementById('deleteDisciplinaBtn'); // Mantenha o mesmo ID para o botão de exclusão, se necessário
const updateDisciplinaBtn = document.getElementById('updateDisciplinaBtn');
const addNotaBtn = document.getElementById('addNotaBtn');
const addAtividadeBtn = document.getElementById('addAtividadeBtn');
const saveAtividadeBtn = document.getElementById('saveAtividadeBtn');
let currentDisciplinaId = null; // ID da disciplina atual
let currentNotaId = null; // ID da nota atual


"---------------------------DISCIPLINAS--------------------------------------------"
// Função para carregar disciplinas do banco de dados
async function loadDisciplinas() {
    try {
        const response = await fetch('http://localhost:5287/api/Disciplinas', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            }
        });
        const disciplinas = await response.json();
        renderDisciplinas(disciplinas);
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
    }
}

// Função para editar uma disciplina
async function editDisciplina(id) {
    currentDisciplinaId = id;

    try {
        const response = await fetch(`http://localhost:5287/api/Disciplinas/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            }
        });
        const disciplina = await response.json();

        if (disciplina) {
            document.getElementById('editNomeDisciplina').value = disciplina.nome;
            document.getElementById('editMediaAprovacao').value = disciplina.mediaAprovacao;
            document.getElementById('editUsuarioId').value = disciplina.usuarioId;
            document.getElementById('editDisciplinaId').value = disciplina.id; // A ID deve ser preenchida
            const modal = new bootstrap.Modal(document.getElementById('editDisciplinaModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Erro ao carregar disciplina:', error);
    }
}

// Atualizar disciplina
updateDisciplinaBtn.addEventListener('click', async () => {
    const nome = document.getElementById('editNomeDisciplina').value;
    const mediaAprovacao = document.getElementById('editMediaAprovacao').value;
    const usuarioId = document.getElementById('editUsuarioId').value;

    if (nome && mediaAprovacao && usuarioId) {
        const disciplina = { nome, mediaAprovacao, usuarioId };

        try {
            await fetch(`http://localhost:5287/api/Disciplinas/${currentDisciplinaId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                },
                body: JSON.stringify(disciplina),
            });

            loadDisciplinas();
            const modal = bootstrap.Modal.getInstance(document.getElementById('editDisciplinaModal'));
            modal.hide();
        } catch (error) {
            console.error('Erro ao atualizar disciplina:', error);
        }
    }
});


// Excluir disciplina
deleteDisciplinaBtn.addEventListener('click', async () => {
    if (currentDisciplinaId !== null) {
        try {
            await fetch(`http://localhost:5287/api/Disciplinas/${currentDisciplinaId}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                }
            });
            loadDisciplinas();
            const modal = bootstrap.Modal.getInstance(document.getElementById('editDisciplinaModal'));
            modal.hide();
        } catch (error) {
            console.error('Erro ao excluir disciplina:', error);
        }
    }
});

// Função para renderizar disciplinas
function renderDisciplinas(disciplinas) {
    disciplinaList.innerHTML = ''; // Limpar a lista antes de renderizar
    disciplinas.forEach((disciplina) => {
        const newItem = document.createElement('li');
        newItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
        newItem.innerHTML = `<span class="disciplina-nome">${disciplina.nome}</span>
                             <button class="btn" onclick="editDisciplina(${disciplina.id})" aria-label="Editar disciplina ${disciplina.nome}">
                                <i class="bi bi-three-dots-vertical"></i>
                             </button>`;
        disciplinaList.appendChild(newItem);
    });
}


// Função para salvar nova disciplina
saveDisciplinaBtn.addEventListener('click', async () => {
    const nome = document.getElementById('nomeDisciplina').value;
    const mediaAprovacao = document.getElementById('mediaAprovacao').value;
    const usuarioId = document.getElementById('usuarioId').value;

    if (nome && mediaAprovacao && usuarioId) {
        const disciplina = { nome, mediaAprovacao, usuarioId };

        try {
            await fetch('http://localhost:5287/api/Disciplinas', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                },
                body: JSON.stringify(disciplina),
            });

            loadDisciplinas();
            resetModal(); 
            const modal = bootstrap.Modal.getInstance(document.getElementById('disciplinaModal'));
            modal.hide();
            window.location.reload();
        } catch (error) {
            console.error('Erro ao salvar disciplina:', error);
        }
    }
});

"--------------------------FIM-DISCIPLINAS--------------------------------------------"

// Função para decodificar o token JWT e obter o payload
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload); 
}

// Função para obter o ID do usuário logado a partir do token JWT
function getLoggedUserId() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('Token JWT não encontrado');
        return null;
    }

    const payload = parseJwt(token); 
    return payload["nameid"]; 
}


// Evento para preencher o ID do usuário ao abrir o modal
document.getElementById('editDisciplinaModal').addEventListener('show.bs.modal', async () => {
    const userData = await fetchLoggedUser();
    if (userData && userData.id) {
        document.getElementById('editUsuarioId').value = userData.id;
    }
});

// Evento para preencher o ID do usuário ao abrir o modal de tarefas
document.getElementById('tarefaModal').addEventListener('show.bs.modal', () => {
    const userId = getLoggedUserId();
    if (userId) {
        document.getElementById('tarefaUsuarioId').value = userId;
        document.getElementById('tarefaUsuarioId').disabled = true; // Desativa o campo para evitar edição
    }
});


// Função para resetar o modal
function resetModal() {
    document.getElementById('disciplinaForm').reset();
    currentDisciplinaId = null;
    saveDisciplinaBtn.textContent = "Salvar";
    deleteDisciplinaBtn.disabled = true; // Desabilita o botão de excluir
}


"---------------------------NOTAS--------------------------------------------"
// Função para adicionar uma nova nota
async function adicionarNota() {
    const nome = document.getElementById('notaNome').value;
    const valorTotal = document.getElementById('notaValorTotal').value;
    const valorNota = document.getElementById('notaValorNota').value;

    const notaData = {
        Valor: parseFloat(valorNota),
        NotaMaxima: parseFloat(valorTotal),
        DisciplinaId: currentMateriaId,
        UsuarioId: 1 // Substitua com o ID correto do usuário
    };

    try {
        const response = await fetch('http://localhost:5287/api/notas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            },
            body: JSON.stringify(notaData)
        });

        if (response.ok) {
            alert('Nota adicionada com sucesso!');
            document.getElementById('notaForm').reset();
            $('#notaModal').modal('hide');
            carregarNotas(); // Atualiza a lista de notas na página
        } else {
            alert('Erro ao adicionar nota. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para carregar a lista de notas
async function carregarNotas() {
    try {
        const response = await fetch('http://localhost:5287/api/notas', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            }
        });
        if (response.ok) {
            const notas = await response.json();
            // Exibir as notas na página (implementação adicional necessária)
            console.log(notas);
        } else {
            alert('Erro ao carregar notas.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para obter detalhes de uma nota específica para edição
async function carregarNotaPorId(id) {
    try {
        const response = await fetch(`http://localhost:5287/api/notas/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            }
        });
        if (response.ok) {
            const nota = await response.json();
            document.getElementById('notaNome').value = nota.Disciplina;
            document.getElementById('notaValorTotal').value = nota.NotaMaxima;
            document.getElementById('notaValorNota').value = nota.Valor;
        } else {
            alert('Erro ao carregar a nota.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para atualizar uma nota existente
async function atualizarNota(id) {
    const nome = document.getElementById('notaNome').value;
    const valorTotal = document.getElementById('notaValorTotal').value;
    const valorNota = document.getElementById('notaValorNota').value;

    const notaData = {
        Id: id,
        Valor: parseFloat(valorNota),
        NotaMaxima: parseFloat(valorTotal),
        DisciplinaId: currentMateriaId,
        UsuarioId: 1 // Substitua com o ID correto do usuário
    };

    try {
        const response = await fetch(`http://localhost:5287/api/notas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            },
            body: JSON.stringify(notaData)
        });

        if (response.ok) {
            alert('Nota atualizada com sucesso!');
            document.getElementById('notaForm').reset();
            $('#notaModal').modal('hide');
            carregarNotas(); // Atualiza a lista de notas na página
        } else {
            alert('Erro ao atualizar a nota.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para excluir uma nota
async function excluirNota(id) {
    try {
        const response = await fetch(`http://localhost:5287/api/notas/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') // Adiciona o token de autenticação
            }
        });

        if (response.ok) {
            alert('Nota excluída com sucesso!');
            carregarNotas(); // Atualiza a lista de notas na página
        } else {
            alert('Erro ao excluir a nota.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}
"--------------------------FIM-NOTAS--------------------------------------------"

"---------------------------TAREFAS--------------------------------------------"

function renderTarefas(tarefas) {
    const tarefaList = document.getElementById("tarefa-list");
    tarefaList.innerHTML = ''; // Limpa a lista antes de renderizar

    tarefas.forEach((tarefa) => {
        const newItem = document.createElement('li');
        newItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        newItem.innerHTML = `
            <span>${tarefa.nome}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteTarefa(${tarefa.id})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        
        tarefaList.appendChild(newItem);
    });
}

async function fetchTarefas() {
    try {
        const response = await fetch("http://localhost:5287/api/Tarefas");
        
        if (!response.ok) {
            throw new Error("Erro ao buscar tarefas");
        }

        const tarefas = await response.json();
        renderTarefas(tarefas);
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function addTarefa() {
    const nome = document.getElementById("tarefaTitulo").value;
    const descricao = document.getElementById("tarefaDescricao").value;
    const realizada = document.getElementById("tarefaRealizada").checked;
    const usuarioId = getLoggedUserId();

    if (!usuarioId) {
        console.error("Erro: ID do usuário não encontrado.");
        return;
    }

    const tarefaData = { nome, descricao, realizada, usuarioId };

    try {
        const response = await fetch("http://localhost:5287/api/Tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwtToken")
            },
            body: JSON.stringify(tarefaData)
        });

        if (!response.ok) {
            throw new Error("Erro ao adicionar tarefa");
        }

        document.getElementById("tarefaForm").reset();
        fetchTarefas();
        new bootstrap.Modal(document.getElementById("tarefaModal")).hide();
        window.location.reload();
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function updateTarefa(id, updatedData) {
    try {
        const response = await fetch(`http://localhost:5287/api/Tarefas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar tarefa");
        }

        fetchTarefas(); // Atualiza a lista de tarefas
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function deleteTarefa(id) {
    try {
        const response = await fetch(`http://localhost:5287/api/Tarefas/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir tarefa");
        }

        fetchTarefas(); // Atualiza a lista de tarefas
    } catch (error) {
        console.error("Erro:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetchTarefas(); // Carrega as tarefas ao iniciar a página
});

document.getElementById("saveTarefaBtn").addEventListener("click", addTarefa);

"--------------------------FIM-TAREFAS--------------------------------------------"


// Torna a função acessível no escopo global
window.editDisciplina = editDisciplina;

// Coloca a função deleteTarefa no escopo global
window.deleteTarefa = deleteTarefa;

// Carrega matérias ao abrir a página
window.onload = loadDisciplinas;

});

