import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DateTimePicker } from "@mui/x-date-pickers";
interface TodoProps {
  id: number;
  text: string;
  dueAt: Dayjs | null;
  isDone: boolean;
  updateText: string;
  updateDueAt: Dayjs | null;
  onUpdateTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateDueAtChange: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  onResetUpdateField: () => void;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleDone: (id: number, isDone: boolean) => void;
}

const Todo = ({
  id,
  text,
  dueAt,
  isDone,
  updateText,
  onUpdateTextChange,
  updateDueAt,
  onUpdateDueAtChange,
  onResetUpdateField,
  onUpdate,
  onDelete,
  onToggleDone,
}: TodoProps) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateSelect = () => {
    setShowUpdateDialog(true);
  };

  const handleDeleteSelect = () => {
    setShowDeleteDialog(true);
  };

  const handleUpdateDialogChange = (open: boolean) => {
    if (!open) {
      onResetUpdateField(); // your onClose logic
    }
    setShowUpdateDialog(open);
  };

  const handleUpdate = (id: number) => {
    onUpdate(id);
    setShowUpdateDialog(false);
    onResetUpdateField();
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            aria-label="Open menu"
            size="icon-sm"
            className={`min-w-56 sm:max-w-1/2 min-h-10 flex-1 rounded-lg py-2 px-3 justify-normal flex flex-col gap-3 cursor-pointer size-auto ${
              isDone ? "bg-green-300 hover:bg-green-300" : ""
            }`}
          >
            <div>
              <h5 className="text-lg flex-1">{text}</h5>
              {dueAt && (
                <p className="text-stone-600">
                  Due: {dayjs(dueAt).format("hh:mm A - DD MMMM, YYYY")}
                </p>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Tasks Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => onToggleDone(id, !isDone)}
              className={`${isDone ? "text-yellow-600" : "text-green-600"}`}
            >
              {isDone ? "Undone" : "Done"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleUpdateSelect}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDeleteSelect}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showUpdateDialog} onOpenChange={handleUpdateDialogChange}>
        <DialogContent className="sm:max-w-106.5">
          <DialogHeader>
            <DialogTitle>Update</DialogTitle>
            <DialogDescription>
              Provide new text and due time for your task. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">Text</FieldLabel>
              <Input
                id="filename"
                name="filename"
                value={updateText || text}
                onChange={onUpdateTextChange}
              />
            </Field>
            <DateTimePicker
              label="Date & time"
              value={updateDueAt || dueAt}
              onChange={(value) => onUpdateDueAtChange(value)}
              slotProps={{
                popper: {
                  disablePortal: true,
                },
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onResetUpdateField}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={() => handleUpdate(id)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-106.5">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>
              Do you really want to delete this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700 transition-all"
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Todo;
