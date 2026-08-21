import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onSubmit: (name: string) => void;
  isPending?: boolean;
};

export function CategoryForm({ onSubmit, isPending }: Props) {
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        id="category-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New category name…"
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || !name.trim()}>
        {isPending ? "Adding…" : "Add"}
      </Button>
    </form>
  );
}
