import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostTask from './Post';
import ConfirmacaoDeDeletar from './confirmacaoDeDelete';
import { SlOptionsVertical } from "react-icons/sl";
import { GoCheck } from "react-icons/go";

const Card = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [activeTaskId, setActiveTaskId] = useState(null); // Armazena o ID da tarefa ativa
  const [editingTask, setEditingTask] = useState(null); // Armazena a tarefa que está sendo editada
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);


  // Função para abrir o popup de confirmação de exclusão
  const handleToggleDelete = (task) => {
    setDeletingTask(task); // Armazena a tarefa que será excluída
    setIsDeletePopupOpen(true); // Abre o popup
  };

  // Função para excluir a tarefa
  const handleDeleteTask = async () => {
    if (deletingTask) {
      try {
        await axios.delete(`http://localhost:3000/api/tasks/${deletingTask._id}`);
        setTasks(prevTasks => prevTasks.filter(task => task._id !== deletingTask._id)); // Remove a tarefa da lista
        handleCloseDeletePopup(); // Fecha o popup após a exclusão
      } catch (error) {
        setError('Erro ao excluir a task.');
      }
    }
  };

  // Abre o pop-up
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  // Fecha o pop-up
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingTask(null); // Limpa a tarefa em edição ao fechar
  };

  // Função para buscar todas as tasks não finalizadas
  const fetchNotFinalizedTasks = async () => {
    setLoading(true);
    setActiveTab('pendentes');
    try {
      const response = await axios.get('http://localhost:3000/api/tasks/naofinalizada');
      setTasks(response.data);
    } catch (error) {
      setError('Erro ao buscar tasks não finalizadas.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar todas as tasks finalizadas
  const fetchFinalizedTasks = async () => {
    setLoading(true);
    setActiveTab('completas');
    try {
      const response = await axios.get('http://localhost:3000/api/tasks/finalizada');
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        throw new Error('Formato de resposta inesperado');
      }
    } catch (error) {
      console.error('Erro ao buscar tasks finalizadas:', error.response || error.message);
      setError('Erro ao buscar tasks finalizadas.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar todas as tasks
  const fetchAllTasks = async () => {
    setLoading(true);
    setActiveTab('todas');
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Erro ao buscar todas as tasks.');
    } finally {
      setLoading(false);
    }
  };
  const handleOpenDeletePopup = () => {
    setIsDeletePopupOpen(true);
  };

  // Função para fechar o popup de confirmação de exclusão
  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };
  // Atualizar status de finalização de uma task
  const handleToggleFinalizada = async (taskId, finalizada) => {
    try {
      await axios.put(`http://localhost:3000/api/tasks/${taskId}`, { finalizada: !finalizada });
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, finalizada: !finalizada } : task
        )
      );
    } catch (error) {
      setError('Erro ao atualizar a task.');
    }
  };

  // Atualizar todas as tasks para "finalizada"
  const handleToggleFinalizadaAll = async () => {
    try {
      await axios.put('http://localhost:3000/api/tasks', { finalizada: true }); // Muda todas para finalizada
      setTasks(prevTasks =>
        prevTasks.map(task => ({ ...task, finalizada: true })) // Atualiza todas as tarefas para finalizadas
      );
    } catch (error) {
      setError('Erro ao atualizar as tasks.');
    }
  };



  // Adicionar uma nova task
  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    handleClosePopup(); // Fecha o pop-up após adicionar a task
    console.log = ('ADICIONAR OK')
  };

  // Atualizar a tarefa existente
  const handleUpdateTask = (updatedTask) => {
    console.log = ('EDIT OK'),
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === updatedTask._id ? updatedTask : task

        )
      );
    handleClosePopup(); // Fecha o pop-up após atualizar a tarefa
  };
  useEffect(() => {
    fetchNotFinalizedTasks(); // Chama a função quando o componente é montado
  }, []); // Dependência vazia para garantir que execute apenas uma vez

  // Renderiza o componente
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <div onClick={() => setActiveTaskId(null)} className='w-[70%] h-[70%] top-[15%] left-[50%] translate-x-[-50%] absolute bg-zinc-800'>
        <div>
          <h1 className='text-7xl text-white ml-[30%] font-sans'>Lista de Tarefas</h1>
        </div>
        <div>
          <button
            onClick={fetchNotFinalizedTasks}
            className={`align-middle h-12 border-b-2 border-t-0 border-l-0 border-r-0 ml-[10%] mr-[4%] border-purple-400 text-purple-400 ${activeTab === 'pendentes' ? 'text-white border-white' : ''}`}
          >
            Pendentes
          </button>
          <button
            onClick={fetchFinalizedTasks}
            className={`align-middle h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 text-purple-400 ${activeTab === 'completas' ? 'border-white text-white' : ''}`}
          >
            Completas
          </button>
          <button
            onClick={fetchAllTasks}
            className={`align-middle h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 text-purple-400 ml-[4%] ${activeTab === 'todas' ? 'border-white text-white' : ''}`}
          >
            Todas
          </button>
          <button
            onClick={handleOpenPopup}
            className='align-middle text-purple-400 h-12 w-28 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 ml-[30%]'
          >
            Criar tarefa
          </button>
          {activeTab === 'pendentes' && (
            <button
              onClick={handleToggleFinalizadaAll}
              className='align-middle w-32 h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 text-purple-400 ml-[2%] mr-[5%]'
            >
              Finalizar Todas
            </button>
          )}
        </div>
        {error && <p>{error}</p>}
        <div className='bg-red-50 w-[80%] ml-[10%] mt-[2%] border h-[52%]'>
          <ul className='list-none h-[97%] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task._id} className='border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 p-2'>
                  <div className="flex justify-between items-center border-b-2 border-t-0 border-l-0 border-r-0">
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={task.finalizada}
                          onChange={() => handleToggleFinalizada(task._id, task.finalizada)}
                        />
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center transition-all duration-300">
                          {task.finalizada && (
                            <GoCheck className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </label>
                      <span>{task.title}</span>
                    </div>
                    <SlOptionsVertical onClick={(e) => { e.stopPropagation(); setActiveTaskId(task._id); }} />
                  </div>
                  <br />
                  <p>{task.description}</p>
                  {activeTaskId === task._id && (
                    <div className="flex justify-end space-x-2 mt-2">
                      <button onClick={() => {
                        setEditingTask(task);
                        handleOpenPopup();
                      }} className="bg-blue-500 text-white py-1 px-3 rounded-md">Editar</button>
                      <button onClick={() => handleToggleDelete(task)} className="bg-red-500 text-white py-1 px-3 rounded-md">Excluir</button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>Nenhuma task encontrada.</p>
            )}
          </ul>
        </div>
      </div>
      {isPopupOpen && (
        <PostTask
          onClose={handleClosePopup}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          task={editingTask}
        />
      )}
      {isDeletePopupOpen && (
        <ConfirmacaoDeDeletar
          onClose={handleCloseDeletePopup}
          onConfirm={handleDeleteTask}
          task={deletingTask}
        />
      )}
    </>
  );
};

export default Card;
