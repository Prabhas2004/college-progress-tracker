
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomHeader from '@/components/CustomHeader';
import { useAuth } from '@/App';
import { useToast } from '@/hooks/use-toast';

const AddStudent = () => {
  const navigate = useNavigate();
  const { currentDepartment } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    semester: '',
    gpa: '',
    attendance: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.studentId || !formData.semester) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate a unique key for storing student data
    const storageKey = `students_${currentDepartment}_sem${formData.semester}`;
    const existingStudents = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Create new student object
    const newStudent = {
      id: parseInt(formData.studentId),
      name: formData.name,
      gpa: parseFloat(formData.gpa) || 0,
      attendance: parseInt(formData.attendance) || 0,
      improvement: Math.random() * 10 - 5, // Random improvement for demo
      email: formData.email,
      phone: formData.phone,
      semester: formData.semester,
      department: currentDepartment,
      dateAdded: new Date().toISOString()
    };
    
    // Check if student ID already exists
    const existingStudent = existingStudents.find((s: any) => s.id === newStudent.id);
    if (existingStudent) {
      toast({
        title: "Error",
        description: "A student with this ID already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Add new student
    existingStudents.push(newStudent);
    localStorage.setItem(storageKey, JSON.stringify(existingStudents));
    
    toast({
      title: "Success",
      description: "Student added successfully!",
    });
    
    // Reset form
    setFormData({
      name: '',
      studentId: '',
      semester: '',
      gpa: '',
      attendance: '',
      email: '',
      phone: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentDepartment');
    localStorage.removeItem('departmentName');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomHeader onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter student's full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      placeholder="Enter student ID"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester *</Label>
                    <Select onValueChange={(value) => handleInputChange('semester', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="4">Semester 4</SelectItem>
                        <SelectItem value="5">Semester 5</SelectItem>
                        <SelectItem value="6">Semester 6</SelectItem>
                        <SelectItem value="7">Semester 7</SelectItem>
                        <SelectItem value="8">Semester 8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      placeholder="Enter GPA (0-10)"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendance">Attendance (%)</Label>
                    <Input
                      id="attendance"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.attendance}
                      onChange={(e) => handleInputChange('attendance', e.target.value)}
                      placeholder="Enter attendance percentage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Student
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
