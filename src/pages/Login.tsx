
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define department credentials
const departmentCredentials = {
  cse: { id: 'cse', password: 'csepass' },
  ds: { id: 'ds', password: 'dspass' },
  aiml: { id: 'aiml', password: 'aimlpass' },
  civil: { id: 'civil', password: 'civilpass' },
  ise: { id: 'ise', password: 'isepass' },
  admin: { id: 'admin', password: 'password' }, // Keep admin for testing
};

// Department display names
const departmentNames = {
  cse: "Computer Science Engineering",
  ds: "Data Science",
  aiml: "AI & ML",
  civil: "Civil Engineering",
  ise: "Information Science Engineering",
  admin: "Administrator"
};

const Login = () => {
  const [departmentId, setDepartmentId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check if the selected department and credentials match
    const validDepartment = Object.keys(departmentCredentials).find(
      (dept) => dept === selectedDepartment && 
      departmentCredentials[dept as keyof typeof departmentCredentials].id === departmentId && 
      departmentCredentials[dept as keyof typeof departmentCredentials].password === password
    );
    
    // Simulating API call
    setTimeout(() => {
      if (validDepartment) {
        // Store department info in localStorage
        localStorage.setItem('currentDepartment', selectedDepartment);
        localStorage.setItem('departmentName', departmentNames[selectedDepartment as keyof typeof departmentNames]);
        
        toast.success(`${departmentNames[selectedDepartment as keyof typeof departmentNames]} login successful!`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid department or credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="login-card w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Department Login</CardTitle>
          <CardDescription className="text-center">
            Enter your department credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department
                </label>
                <Select 
                  value={selectedDepartment} 
                  onValueChange={setSelectedDepartment}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departments</SelectLabel>
                      <SelectItem value="cse">Computer Science (CSE)</SelectItem>
                      <SelectItem value="ds">Data Science (DS)</SelectItem>
                      <SelectItem value="aiml">AI & ML (AIML)</SelectItem>
                      <SelectItem value="civil">Civil Engineering</SelectItem>
                      <SelectItem value="ise">Information Science (ISE)</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="departmentId" className="text-sm font-medium">
                  Department ID
                </label>
                <Input
                  id="departmentId"
                  placeholder="Enter department ID"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-gray-500 mt-2">
            <p>Demo credentials for departments:</p>
            <p>CSE: cse/csepass | DS: ds/dspass | AIML: aiml/aimlpass</p>
            <p>Civil: civil/civilpass | ISE: ise/isepass | Admin: admin/password</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
