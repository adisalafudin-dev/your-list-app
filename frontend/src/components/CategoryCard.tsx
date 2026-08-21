import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

type Props = {
  category: Category;
  onDelete: (id: number) => void;
};

export function CategoryCard({ category, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded hover:bg-gray-200 transition">
      <Link
        to={`/categories/${category.id}`}
        className="font-medium hover:underline flex-1"
      >
        {category.name}
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(category.id)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        aria-label={`Delete ${category.name}`}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
