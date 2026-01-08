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
import React, { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface Todo {
  id: number;
  text: string;
  datetime: Dayjs | null;
  isDone: boolean;
  isShow: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [createText, setCreateText] = useState("");
  const [createDateTime, setCreateDateTime] = useState<Dayjs | null>(null);

  const handleCreateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateText(e.currentTarget.value);
  };

  const handleResetCreateTodoFields = () => {
    setCreateText("");
  };

  const handleCreateTodo = () => {
    if (createText.length === 0) return;
    const newIndex = todos.length;
    const newTodo: Todo = {
      id: newIndex,
      text: createText,
      datetime: createDateTime,
      isDone: false,
      isShow: true,
    };
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
                datetime={createDateTime}
                onDatetimeChange={setCreateDateTime}
                onCancel={handleResetCreateTodoFields}
                onCreate={handleCreateTodo}
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex sm:flex-row sm:flex-wrap">
              {todos.map((todo) => (
                <div
                  key={`${todo.text}-${todo.datetime}`}
                  className="ring ring-gray-300 rounded-2 min-w-56 sm:max-w-1/2 min-h-10 flex-1 rounded-lg py-2 px-3 flex flex-col justify-between gap-3"
                >
                  <h5 className="text-lg flex-1">{todo.text}</h5>
                  {todo.datetime && (
                    <p className="text-stone-600">
                      Due:{" "}
                      {dayjs(todo.datetime).format("hh:mm - DD MMMM, YYYY")}
                    </p>
                  )}
                </div>
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
                datetime={createDateTime}
                onDatetimeChange={setCreateDateTime}
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
