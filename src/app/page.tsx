"use client";
import { useState, useEffect } from "react";
import { Task, getTasks, createTask, toggleTask, deleteTask } from "../lib/api/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createTask(title, description);
    setTitle("");
    setDescription("");
    loadTasks();
    setLoading(false);
  }

  async function handleToggle(id: string, isCompleted: boolean) {
    await toggleTask(id, isCompleted);
    loadTasks();
  }

  async function handleDelete(id: string) {
    await deleteTask(id);
    loadTasks();
  }

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Tasks
          </h1>
          <p className="text-purple-200">Organize sua vida de forma elegante</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nova tarefa..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adicionando...
                </span>
              ) : (
                "Adicionar Tarefa"
              )}
            </button>
          </form>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Section
            title="Pendentes"
            icon="⏳"
            tasks={pendingTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            color="from-yellow-500 to-orange-500"
          />
          <Section
            title="Concluídas"
            icon="✅"
            tasks={completedTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            color="from-green-500 to-emerald-500"
          />
          
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  icon,
  tasks,
  onToggle,
  onDelete,
  color,
}: {
  title: string;
  icon: string;
  tasks: Task[];
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  color: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
      <div className={`bg-gradient-to-r ${color} rounded-xl p-3 mb-4`}>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
          <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2 opacity-50">📝</div>
            <p className="text-white/60 text-sm">Nada por aqui</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all group"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => onToggle(task.id, task.isCompleted)}
                  className="mt-1 h-4 w-4 rounded border-white/30 bg-white/20 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-white mb-1 ${task.isCompleted ? "line-through opacity-60" : ""
                      }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-white/70 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 rounded-lg hover:bg-red-500/20"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}