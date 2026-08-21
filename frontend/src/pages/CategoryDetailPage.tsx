import { useParams, Link } from "react-router-dom";

export function CategoryDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <Link to="/" className="text-sm text-blue-500 hover:underline">
        ← Back to categories
      </Link>
      <h1 className="text-2xl font-bold mt-4">
        Category #{id}
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        Items will be implemented in the next task.
      </p>
    </div>
  );
}
