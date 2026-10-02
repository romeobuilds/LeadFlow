"use client";

import { useState, useTransition } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadSchema, type LeadFormValues } from "@/lib/validations/lead";
import { LEAD_PRIORITIES } from "@/lib/types";
import { STAGE_META } from "@/lib/stage-meta";
import { createLead, updateLead } from "@/app/(dashboard)/leads/actions";
import type { Lead } from "@/lib/types";

function toFormValues(lead?: Lead): LeadFormValues {
  return {
    name: lead?.name ?? "",
    email: lead?.email ?? undefined,
    phone: lead?.phone ?? undefined,
    company: lead?.company ?? undefined,
    value: lead?.value ?? 0,
    stage: lead?.stage ?? "new",
    source: lead?.source ?? undefined,
    priority: lead?.priority ?? "medium",
    expectedClose: lead?.expected_close ?? undefined,
  };
}

interface LeadDialogProps {
  lead?: Lead;
  /** Custom trigger element; defaults to a "New lead" button. */
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LeadDialog({ lead, trigger, open, onOpenChange }: LeadDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const isEdit = Boolean(lead);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    // zod v4 transforms change the output type; the form manages input values.
    resolver: zodResolver(leadSchema) as Resolver<LeadFormValues>,
    defaultValues: toFormValues(lead),
  });

  function onSubmit(values: LeadFormValues) {
    startTransition(async () => {
      const result = isEdit
        ? await updateLead(lead!.id, values)
        : await createLead(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "Lead updated" : "Lead created");
      setDialogOpen(false);
      if (!isEdit) reset(toFormValues());
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            trigger ?? (
              <Button>
                <PlusIcon className="size-4" />
                New lead
              </Button>
            )
          }
        />
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit lead" : "New lead"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the lead details below."
              : "Add a new lead to your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3"
          noValidate
        >
          <div className="grid gap-1.5">
            <Label htmlFor="lead-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lead-name"
              placeholder="Ada Lovelace"
              required
              disabled={isPending}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="ada@company.com"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                placeholder="+1 555 000 1234"
                disabled={isPending}
                {...register("phone")}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                placeholder="Acme Inc."
                disabled={isPending}
                {...register("company")}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-source">Source</Label>
              <Input
                id="lead-source"
                placeholder="Website, Referral, …"
                disabled={isPending}
                {...register("source")}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="lead-value">Value (USD)</Label>
              <Input
                id="lead-value"
                type="number"
                min={0}
                step="any"
                disabled={isPending}
                {...register("value")}
              />
              {errors.value && (
                <p className="text-xs text-destructive">{errors.value.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lead-expectedClose">Expected close</Label>
              <Input
                id="lead-expectedClose"
                type="date"
                disabled={isPending}
                {...register("expectedClose")}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Stage</Label>
              <Controller
                control={control}
                name="stage"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGE_META.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2Icon className="animate-spin" />}
              {isEdit ? "Save changes" : "Create lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
