import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const PostTask = ({ onClose, onAddTask, onUpdateTask, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || ''); 
      setDescription(task.description || ''); 
    } else {
      setTitle(''); 
      setDescription('');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !description) {
      setError('Título e descrição são obrigatórios.');
      setLoading(false);
      return; 
    }

    try {
      if (task) {
        const updatedTask = { ...task, title, description };
        const response = await axios.put(`http://localhost:3000/api/tasks/${task._id}/update`, updatedTask);
        onUpdateTask(response.data); 
      } else {
        const newTask = { 
          
          title, 
          description, 
          finalizada: false 
        };
        const response = await axios.post('http://localhost:3000/api/tasks', newTask);
        onAddTask(response.data); 
      }

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
