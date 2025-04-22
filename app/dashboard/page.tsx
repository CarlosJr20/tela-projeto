"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/pt-br"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Modal, Button, Input, Label } from "@/components/ui"
import { useRouter } from "next/navigation"
import { getAuthToken, removeAuthToken } from "@/services/auth-service"
import { LogOut, X } from "lucide-react"

const localizer = momentLocalizer(moment)

export default function DashboardPage() {
    const router = useRouter()
    const [events, setEvents] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", details: "" })

    useEffect(() => {
        fetch("http://localhost:5000/api/tasks", {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((task) => ({
                    ...task,
                    start: new Date(task.start),
                    end: new Date(task.end),
                }))
                setEvents(formatted)
            })
    }, [])

    const handleLogout = () => {
        removeAuthToken()
        router.push("/")
    }

    const handleSelectSlot = ({ start }) => {
        const defaultEnd = new Date(start)
        defaultEnd.setHours(defaultEnd.getHours() + 1)
        setSelectedEvent(null)
        setNewEvent({
            title: "",
            start: start.toISOString().slice(0, 16),
            end: defaultEnd.toISOString().slice(0, 16),
            details: "",
        })
        setModalOpen(true)
    }

    function extractUserIdFromToken(token: string): number | null {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.id || payload.userId
        } catch {
            return null
        }
    }

    const handleAddOrEditEvent = () => {
        const token = getAuthToken()
        const userId = parseInt(localStorage.getItem("userId") || sessionStorage.getItem("userId") || "0", 10)

        if (!userId) {
            console.error("Usuário não logado.")
            return
        }

        const updatedEvent = {
            ...newEvent,
            start: new Date(newEvent.start),
            end: new Date(newEvent.end),
            userId
        }

        if (selectedEvent) {
            // PUT para atualizar tarefa existente
            fetch(`http://localhost:5000/api/tasks/${selectedEvent.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedEvent),
            })
                .then((res) => res.json())
                .then((updated) => {
                    setEvents(events.map((e) => (e.id === updated.id ? updated : e)))
                })
                .finally(() => setModalOpen(false))
        } else {
            // POST para criar nova tarefa
            fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedEvent),
            })
                .then((res) => res.json())
                .then((saved) => {
                    setEvents([...events, {
                        ...saved,
                        start: new Date(saved.start),
                        end: new Date(saved.end),
                    }])
                })
                .finally(() => setModalOpen(false))
        }
    }

    const handleSelectEvent = (event) => {
        setSelectedEvent(event)
        setNewEvent({
            title: event.title,
            start: new Date(event.start).toISOString().slice(0, 16),
            end: new Date(event.end).toISOString().slice(0, 16),
            details: event.details,
        })
        setModalOpen(true)
    }

    const handleDeleteEvent = () => {
        fetch(`http://localhost:5000/api/tasks/${selectedEvent.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
        }).then(() => {
            setEvents(events.filter((e) => e.id !== selectedEvent.id))
            setModalOpen(false)
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <LogOut size={18} className="mr-2" />
                        Sair
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Calendário de Agendamentos</h2>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        selectable
                        views={["month", "week", "day", "agenda"]}
                        defaultView="month"
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        messages={{
                            today: "Hoje",
                            previous: "Anterior",
                            next: "Próximo",
                            month: "Mês",
                            week: "Semana",
                            day: "Dia",
                            agenda: "Agenda",
                            noEventsInRange: "Nenhum evento neste intervalo",
                            date: "Data",
                            time: "Hora",
                            event: "Evento",
                            allDay: "Dia inteiro",
                            showMore: (count) => `+${count} mais`,
                        }}
                    />
                </div>
            </main>

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <div className="relative space-y-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold">
                            {selectedEvent ? "Editar Evento" : "Novo Evento"}
                        </h3>
                        <div>
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="start">Início</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={newEvent.start}
                                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end">Fim</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={newEvent.end}
                                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="details">Detalhes</Label>
                            <textarea
                                id="details"
                                value={newEvent.details}
                                onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                                className="w-full border rounded-md p-2"
                                rows={4}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-2">
                            {selectedEvent && (
                                <Button onClick={handleDeleteEvent} variant="destructive">
                                    Deletar
                                </Button>
                            )}
                            <Button onClick={handleAddOrEditEvent}>
                                {selectedEvent ? "Salvar Alterações" : "Salvar"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}