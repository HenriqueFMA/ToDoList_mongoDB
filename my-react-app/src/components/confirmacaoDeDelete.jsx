import React from 'react';

const ConfirmacaoDeDeletar = ({ onClose, onConfirm, task }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-80 text-center">
        <h2>Tem certeza que deseja excluir esta tarefa?</h2>
        <p>{task?.title}</p>
        <div className="flex gap-10 ml-6 mt-2">
        <button onClick={onConfirm} className="bg-red-500 text-white py-2 px-4 rounded-md">
          Confirmar
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded-md">
          Cancelar
        </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoDeDeletar;
