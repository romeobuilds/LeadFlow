"use client";

import { useState, useTransition } from "react";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteNote } from "@/app/(dashboard)/leads/actions";
import { timeAgo } from "@/lib/format-date";
import type { Note } from "@/lib/types";

export function NoteCard({ note }: { note: Note }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteNote(note.id, note.lead_id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Note deleted");
      setConfirmOpen(false);
    });
  }

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="group rounded-lg bg-muted/40 p-3 ring-1 ring-foreground/5 transition-colors hover:bg-muted/70">
        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
        <div className="mt-2 flex items-center justify-between">
          <time
            dateTime={note.created_at}
            className="text-xs text-muted-foreground"
          >
            {timeAgo(note.created_at)}
          </time>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"
            aria-label="Delete note"
            onClick={() => setConfirmOpen(true)}
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
}
