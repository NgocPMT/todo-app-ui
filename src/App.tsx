import { IconNotes } from "@tabler/icons-react";
import CreateTodoDialog from "./components/create-todo-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./components/ui/empty";
import React, { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Todo from "./components/Todo";

interface TodoDto {
  id: number;
  text: string;
  dueAt: string;
  isDone: boolean;
  isShow: boolean;
}

interface CreateTodoDto {
  text: string;
  dueAt: string;
}
interface Todo {
  id: number;
  text: string;
  dueAt: Dayjs | null;
  isDone: boolean;
  isShow: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [createText, setCreateText] = useState("");
  const [createDueAt, setCreateDueAt] = useState<Dayjs | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTodos = async () => {
      try {
        const res: Response = await fetch(
          `${import.meta.env.VITE_API_URL}/todos`,
          {
            signal,
          }
        );
        const data = await res.json();
        const newTodos = data.result.map((todo: TodoDto) => {
          return { ...todo, dueAt: dayjs(todo.dueAt) } satisfies Todo;
        });
        setTodos(newTodos);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.log(error.message);
        }
      }
    };

    fetchTodos();

    return () => controller.abort();
  }, []);

  const handleCreateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateText(e.currentTarget.value);
  };

  const handleResetCreateTodoFields = () => {
    setCreateText("");
  };

  const handleCreateTodo = async () => {
    if (!createDueAt) return;
    if (createText.length === 0) return;

    const res: Response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({
        text: createText,
        dueAt: createDueAt.toISOString(),
      } satisfies CreateTodoDto),
    });
    const data: TodoDto = await res.json();
    const newTodo: Todo = { ...data, dueAt: dayjs(data.dueAt) };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    handleResetCreateTodoFields();
  };

  return (
    <div>
      <header className="mb-5">
        <nav className="px-4 py-2 max-w-5xl md:mx-auto md:py-3">
          <a className="text-lg font-semibold md:text-xl">Todo App</a>
        </nav>
        <hr />
      </header>

      <main className="px-4">
        {todos.length > 0 ? (
          <div className="max-w-5xl md:mx-auto">
            <div className="mb-5">
              <CreateTodoDialog
                text={createText}
                onTextChange={handleCreateTextChange}
                dueAt={createDueAt}
                onDatetimeChange={setCreateDueAt}
                onCancel={handleResetCreateTodoFields}
                onCreate={handleCreateTodo}
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex sm:flex-row sm:flex-wrap">
              {todos.map((todo) => (
                <Todo text={todo.text} dueAt={todo.dueAt} />
              ))}
            </div>
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconNotes />
              </EmptyMedia>
              <EmptyTitle>No Tasks Yet</EmptyTitle>

              <EmptyDescription>
                You haven&apos;t created any tasks yet. Get started by create
                your first task.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateTodoDialog
                text={createText}
                onTextChange={handleCreateTextChange}
                dueAt={createDueAt}
                onDatetimeChange={setCreateDueAt}
                onCancel={handleResetCreateTodoFields}
                onCreate={handleCreateTodo}
              />
            </EmptyContent>
          </Empty>
        )}
      </main>
    </div>
  );
}

export default App;
