Lista de Tarefas - React e MongoDB
Este projeto é uma aplicação de lista de tarefas (To-Do List) desenvolvida utilizando React no front-end e MongoDB no back-end para gerenciamento de tarefas. A aplicação permite adicionar tarefas, atualizar o título e a descrição, e alterar o estado de conclusão (finalizado ou não concluído).

Funcionalidades
Adicionar Tarefa: Permite a criação de novas tarefas com título e descrição.
Atualizar Tarefa: Altere o título e a descrição de uma tarefa existente.
Alterar Estado: Marque uma tarefa como finalizada ou não concluída.
Tecnologias Utilizadas
Frontend: React.js
Backend: Node.js, Express.js
Banco de Dados: MongoDB
Instalação e Execução
Clone o repositório:



bash
Copy code
cd ../frontend
npm start
API Endpoints
GET /tasks: Retorna todas as tarefas.
POST /tasks: Adiciona uma nova tarefa.
PUT /tasks/
: Atualiza uma tarefa existente (título e descrição).
PATCH /tasks/
: Atualiza o estado de conclusão de uma tarefa.
DELETE /tasks/
: Remove uma tarefa.
