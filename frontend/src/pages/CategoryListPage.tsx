import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/hooks/useAuth";
import { CategoryForm } from "@/components/CategoryForm";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function CategoryListPage() {
  const { categories, isLoading, create, remove } = useCategories();
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Listing Tracker</h1>
          {user && (
            <p className="text-sm text-gray-500">{user.email}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
          className="text-gray-500"
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>

      {/* Add Category Form */}
      <div className="mb-6">
        <CategoryForm
          onSubmit={(name) => create.mutate(name)}
          isPending={create.isPending}
        />
      </div>

      {/* Category List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first category to start tracking
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onDelete={(id) => remove.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
