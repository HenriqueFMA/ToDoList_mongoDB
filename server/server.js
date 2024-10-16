const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // Importa o Mongoose

const app = express();
const port = 3000; // Porta para seu servidor Express

// Middleware
app.use(cors());
app.use(express.json()); // Substitui bodyParser.json() pelo método embutido do Express

// Conectar ao MongoDB
const mongoURI = 'mongodb://user_42trtrtas:p42trtrtas@ocdb.app:5050/db_42trtrtas?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o modelo de Task
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  due_date: { type: Date },
  finalizada: { type: Boolean, default: false }
});


const Task = mongoose.model('Task', TaskSchema);

// Endpoint para obter todas as tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); // Encontra todas as tasks no MongoDB
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint para obter tasks não finalizadas
app.get('/api/tasks/naofinalizada', async (req, res) => {
  try {
    const tasks = await Task.find({ finalizada: false });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint para obter tasks finalizadas
app.get('/api/tasks/finalizada', async (req, res) => {
  try {
    const tasks = await Task.find({ finalizada: true });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint para criar uma nova task
app.post('/api/tasks', async (req, res) => {
  try {
    const { id , title, description, status } = req.body;

    // Valida os dados de entrada
    if (!title) {
      return res.status(400).json({ error: 'O título é obrigatório' });
    }

    // Cria uma nova tarefa sem task_id
    const newTask = new Task({
      id,
      title,
      description,
      status: status || 'pending',
    });

    await newTask.save(); // Salva a tarefa no MongoDB
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint para atualizar todas as tasks para "finalizada: true"
app.put('/api/tasks', async (req, res) => {
  try {
    const result = await Task.updateMany({}, { finalizada: true });

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Nenhuma tarefa encontrada para atualizar.' });
    }

    res.status(200).json({ message: 'Todas as tarefas foram atualizadas para finalizada: true' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar todas as tarefas', details: err.message });
  }
});

// Endpoint para atualizar uma task específica por ID
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { finalizada } = req.body;

  try {
    if (finalizada === undefined) {
      return res.status(400).json({ error: 'O campo finalizada deve ser fornecido.' });
    }

    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, { finalizada }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Nenhuma tarefa encontrada para atualizar.' });
    }

    res.status(200).json({ message: `Tarefa atualizada para finalizada: ${finalizada}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar a tarefa', details: err.message });
  }
});

// Endpoint para atualizar o título ou a descrição de uma task específica por ID
app.put('/api/tasks/:id/update', async (req, res) => {
  const taskId = req.params.id; // ID da tarefa a ser atualizada
  const { title, description } = req.body; // Dados a serem atualizados

  try {
    // Cria um objeto com as atualizações
    const updates = {};
    if (title) updates.title = title; // Atualiza o título se fornecido
    if (description) updates.description = description; // Atualiza a descrição se fornecido

    // Atualiza a task no MongoDB
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId }, // Busca a task pelo ID
      { $set: updates }, // Define os novos valores
      { new: true } // Retorna a task atualizada
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task não encontrada.' });
    }

    res.status(200).json({ message: 'Tarefa atualizada com sucesso.', task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar a tarefa', details: err.message });
  }
});


// Endpoint para deletar uma task por ID
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const result = await Task.deleteOne({ _id: taskId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task não encontrada.' });
    }

    res.status(200).json({ message: 'Task deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar a task:', err);
    res.status(500).json({ message: 'Erro ao deletar a task.', error: err });
  }
});

// Endpoint para atualizar uma task específica por ID
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { finalizada } = req.body;

  try {
    if (finalizada === undefined) {
      return res.status(400).json({ error: 'O campo finalizada deve ser fornecido.' });
    }

    console.log(`Atualizando tarefa com ID: ${taskId} para finalizada: ${finalizada}`);

    const updatedTask = await Task.findOneAndUpdate({ _id: taskId }, { finalizada }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Nenhuma tarefa encontrada para atualizar.' });
    }

    res.status(200).json({ message: `Tarefa atualizada para finalizada: ${finalizada}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar a tarefa', details: err.message });
  }
});

// Endpoint para obter uma task por ID
app.get('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task não encontrada.' });
    }

    // Certifique-se de que as datas estão no formato correto
    const taskData = {
      ...task.toObject(), // Converte o documento Mongoose para um objeto JavaScript simples
      created_at: task.created_at, // Incluindo a data de criação
      updated_at: task.updated_at  // Incluindo a data de atualização
    };

    res.status(200).json(taskData);
  } catch (err) {
    console.error('Erro ao buscar a task:', err);
    res.status(500).json({ message: 'Erro ao buscar a task.', error: err });
  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
