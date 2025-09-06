export type Task = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

// base da API (lê de env em produção)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// Buscar todas
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar tarefas");
  return res.json();
}

// Criar
export async function createTask(title: string, description: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Erro ao criar tarefa");
}

// Atualizar status
export async function toggleTask(id: string, isCompleted: boolean): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/completed`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isCompleted: !isCompleted })
  });
  if (!res.ok) throw new Error("Erro ao atualizar tarefa");
  return res.json();
}

// Deletar
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/delete`, { method: "PATCH" });
  if (!res.ok) throw new Error("Erro ao deletar tarefa");
}
