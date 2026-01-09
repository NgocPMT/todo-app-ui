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
import { Dayjs } from "dayjs";
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

interface UpdateTodoDto {
  data: {
    text?: string;
    dueAt?: string;
    isDone?: boolean;
  };
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
  const [updateText, setUpdateText] = useState("");
  const [updateDueAt, setUpdateDueAt] = useState<Dayjs | null>(null);

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

  const handleUpdateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateText(e.currentTarget.value);
  };

  const handleResetCreateTodoFields = () => {
    setCreateText("");
    setCreateDueAt(null);
  };

  const handleResetUpdateTodoFields = () => {
    setUpdateText("");
    setUpdateDueAt(null);
  };

  const handleUpdateTodo = async (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            text: updateText || todo.text,
            dueAt: updateDueAt || todo.dueAt,
          };
        } else {
          return todo;
        }
      })
    );
    await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        data: {
          text: updateText,
          dueAt: updateDueAt ? updateDueAt.toISOString() : undefined,
        },
      } satisfies UpdateTodoDto),
    });
  };

  const handleToggleDoneTodo = async (id: number, isDone: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isDone,
          };
        } else {
          return todo;
        }
      })
    );
    await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        data: {
          isDone,
        },
      } satisfies UpdateTodoDto),
    });
  };

  const handleDeleteTodo = async (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
      method: "DELETE",
    });
  };

  const handleCreateTodo = async () => {
    if (!createDueAt || createText.length === 0) return;

    const res: Response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({
        text: createText,
        dueAt: createDueAt.toISOString(),
      } satisfies CreateTodoDto),
    });
    const data: TodoDto = await res.json();
    const newTodo: Todo = {
      ...data,
      text: createText,
      dueAt: dayjs(data.dueAt),
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    handleResetCreateTodoFields();
  };

  return (
    <div>
      <header className="mb-5">
        <nav className="px-4 py-2 max-w-5xl md:px-0 md:mx-auto md:py-3">
          <a className="text-lg font-semibold md:text-xl">Todo List</a>
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
                <Todo
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  isDone={todo.isDone}
                  updateText={updateText}
                  onUpdateTextChange={handleUpdateTextChange}
                  onResetUpdateField={handleResetUpdateTodoFields}
                  dueAt={todo.dueAt}
                  updateDueAt={updateDueAt}
                  onUpdateDueAtChange={setUpdateDueAt}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                  onToggleDone={handleToggleDoneTodo}
                />
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
