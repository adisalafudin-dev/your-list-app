import { Routes, Route } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CategoryListPage } from "@/pages/CategoryListPage";
import { CategoryDetailPage } from "@/pages/CategoryDetailPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<CategoryListPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
