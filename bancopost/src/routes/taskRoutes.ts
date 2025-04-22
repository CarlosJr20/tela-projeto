import express from 'express'
import Task from '../models/Task'

const router = express.Router()

// GET
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tarefas', error })
    }
})

// POST
router.post('/', async (req, res) => {
    try {
        const { title, start, end, details, userId } = req.body
        const task = await Task.create({ title, start, end, details, userId })
        res.status(201).json(task)
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar tarefa', error })
    }
})

// PUT
router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Task.update(req.body, { where: { id } })
        const updatedTask = await Task.findByPk(id)
        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarefa não encontrada' })
        }
        res.json(updatedTask)
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar tarefa', error })
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await Task.destroy({ where: { id } })
        if (deleted) {
            return res.sendStatus(204)
        } else {
            return res.status(404).json({ message: 'Tarefa não encontrada' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao deletar tarefa', error })
    }
})

export default router
