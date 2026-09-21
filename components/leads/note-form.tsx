"use client";

import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addNote } from "@/app/(dashboard)/leads/actions";

export function NoteForm({ leadId }: { leadId: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addNote(leadId, content);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setContent("");
      toast.success("Note added");
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      <Textarea
        placeholder="Write a note about this lead…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
        rows={3}
        maxLength={2000}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending || !content.trim()}>
          {isPending && <Loader2Icon className="animate-spin" />}
          Add note
        </Button>
      </div>
    </form>
  );
}
