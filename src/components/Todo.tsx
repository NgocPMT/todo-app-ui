import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface TodoProps {
  text: string;
  dueAt: Dayjs | null;
}

const Todo = ({ text, dueAt }: TodoProps) => {
  return (
    <div
      key={`${text}-${dueAt}`}
      className="ring ring-gray-300 rounded-2 min-w-56 sm:max-w-1/2 min-h-10 flex-1 rounded-lg py-2 px-3 flex flex-col justify-between gap-3"
    >
      <h5 className="text-lg flex-1">{text}</h5>
      {dueAt && (
        <p className="text-stone-600">
          Due: {dayjs(dueAt).format("hh:mm - DD MMMM, YYYY")}
        </p>
      )}
    </div>
  );
};

export default Todo;
