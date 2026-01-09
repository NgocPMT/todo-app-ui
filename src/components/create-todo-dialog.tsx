import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import type React from "react";
import { Plus } from "lucide-react";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";

interface CreateTodoDialogProps {
  text: string;
  dueAt: Dayjs | null;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDatetimeChange: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  onCreate: () => void;
  onCancel: () => void;
  trigger?: React.ReactElement;
}

const CreateTodoDialog = ({
  text,
  dueAt,
  onTextChange,
  onDatetimeChange,
  onCreate,
  onCancel,
  trigger,
}: CreateTodoDialogProps) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="outline">
              <Plus /> Create Task
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Create new task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex gap-3 flex-col">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                placeholder="Text"
                value={text}
                onChange={onTextChange}
              />
            </div>
            <DateTimePicker
              label="Date & time"
              value={dueAt}
              onChange={(value) => onDatetimeChange(value)}
              slotProps={{
                popper: {
                  disablePortal: true,
                },
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={onCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateTodoDialog;
