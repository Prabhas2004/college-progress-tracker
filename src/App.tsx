
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Semester from "./pages/Semester";
import StudentDetail from "./pages/StudentDetail";
import AddStudent from "./pages/AddStudent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create Auth Context
export const AuthContext = createContext<{
  currentDepartment: string | null;
  departmentName: string | null;
  isAuthenticated: boolean;
}>({
  currentDepartment: null,
  departmentName: null,
  isAuthenticated: false,
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Auth Provider Component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentDepartment, setCurrentDepartment] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status from localStorage
    const storedDepartment = localStorage.getItem('currentDepartment');
    const storedDepartmentName = localStorage.getItem('departmentName');
    
    if (storedDepartment && storedDepartmentName) {
      setCurrentDepartment(storedDepartment);
      setDepartmentName(storedDepartmentName);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentDepartment, departmentName, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/semester/:semId" element={
              <ProtectedRoute>
                <Semester />
              </ProtectedRoute>
            } />
            <Route path="/student/:semId/:studentId" element={
              <ProtectedRoute>
                <StudentDetail />
              </ProtectedRoute>
            } />
            <Route path="/add-student" element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
