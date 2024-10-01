import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Importa a função uuid

const PostTask = ({ onClose, onAddTask, onUpdateTask, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efeito para preencher os campos com dados da tarefa, se estiver editando
  useEffect(() => {
    if (task) {
      setTitle(task.title || ''); // Garante que não seja undefined
      setDescription(task.description || ''); // Garante que não seja undefined
    } else {
      setTitle(''); // Limpa o título ao abrir para criar uma nova tarefa
      setDescription(''); // Limpa a descrição ao abrir para criar uma nova tarefa
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !description) {
      setError('Título e descrição são obrigatórios.');
      setLoading(false);
      return; // Impede o envio se os campos estiverem vazios
    }

    try {
      if (task) {
        // Se task estiver definida, estamos editando
        const updatedTask = { ...task, title, description };
        const response = await axios.put(`http://localhost:3000/api/tasks/${task.task_id}/update`, updatedTask);
        onUpdateTask(response.data); // Atualiza a tarefa no componente pai
      } else {
        // Se não, estamos criando uma nova tarefa
        const newTask = { 
          task_id: uuidv4(), // Gera um ID único para a nova tarefa
          title, 
          description, 
          finalizada: false // Define a task como não finalizada por padrão
        };
        const response = await axios.post('http://localhost:3000/api/tasks', newTask);
        onAddTask(response.data); // Adiciona a nova tarefa no componente pai
      }

      // Limpa os campos e fecha o pop-up
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      setError(`Erro ao salvar a tarefa: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-80 text-center">
        <h2 className="mb-4 text-lg font-bold">{task ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Descrição da tarefa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {loading ? <p>Enviando...</p> : error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {task ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTask;
