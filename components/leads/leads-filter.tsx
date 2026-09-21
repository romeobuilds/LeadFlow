"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_META } from "@/lib/stage-meta";

interface LeadsFilterProps {
  sources: string[];
}

export function LeadsFilter({ sources }: LeadsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const query = searchParams.get("q") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const source = searchParams.get("source") ?? "";
  const hasFilters = Boolean(query || stage || source);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name, company, or email…"
          defaultValue={query}
          onChange={(e) => updateParam("q", e.target.value || null)}
          className="pl-8"
        />
      </div>

      <Select
        value={stage || "all"}
        onValueChange={(v) => updateParam("stage", v === "all" ? null : v)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stages</SelectItem>
          {STAGE_META.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={source || "all"}
        onValueChange={(v) => updateParam("source", v === "all" ? null : v)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          {sources.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.replace(pathname, { scroll: false })}
        >
          <XIcon className="size-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
