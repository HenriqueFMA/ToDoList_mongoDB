        import React, { useState, useEffect } from 'react';
        import axios from 'axios';

        interface Task {
        task_id: number;
        title: string;
        description: string;
        }

        interface EditTaskPopupProps {
        task: Task;
        onClose: () => void;
        onUpdateTask: (updatedTask: Task) => void;
        }

        const EditTaskPopup: React.FC<EditTaskPopupProps> = ({ task, onClose, onUpdateTask }) => {
        const [title, setTitle] = useState<string>(task.title);
        const [description, setDescription] = useState<string>(task.description);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null); // Ajuste aqui

        useEffect(() => {
            setTitle(task.title);
            setDescription(task.description);
        }, [task]);

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            try {
            const response = await axios.put(`http://localhost:3000/api/tasks/${task.task_id}/update`, {
                title,
                description,
            });
            onUpdateTask(response.data.task); // Atualiza a tarefa no componente pai
            onClose(); // Fecha o pop-up
            } catch (err) {
            setError('Erro ao atualizar a tarefa.'); // Agora isso está correto
            } finally {
            setLoading(false);
            }
        };

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Editar Tarefa</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm">Título</label>
                    <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border w-full p-2 rounded"
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm">Descrição</label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border w-full p-2 rounded"
                    required
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Atualizando...' : 'Salvar'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 text-white py-2 px-4 rounded ml-2"
                >
                    Cancelar
                </button>
                </form>
            </div>
            </div>
        );
        };

        export default EditTaskPopup;
