import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Mail, Print } from 'lucide-react';
import { toast } from 'sonner';
import CustomHeader from '@/components/CustomHeader';
import StudentCard from '@/components/StudentCard';
import SemesterSelector from '@/components/SemesterSelector';
import ExcelUpload from '@/components/ExcelUpload';
import { generateMockStudents } from '@/lib/mock-data';
import { useAuth } from '@/App';

const Semester = () => {
  const { semId } = useParams<{ semId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();
  const { currentDepartment } = useAuth();

  useEffect(() => {
    // Generate mock students based on semester and department
    let mockStudents = generateMockStudents(semId || '1', currentDepartment || undefined);
    
    // Add uploaded students from localStorage
    const uploadedStudents = JSON.parse(localStorage.getItem('uploadedStudents') || '[]');
    const semesterUploadedStudents = uploadedStudents.filter((student: any) => 
      student.semester === semId && student.department === currentDepartment
    );
    
    // Filter out deleted students
    const deletedStudents = JSON.parse(localStorage.getItem('deletedStudents') || '[]');
    mockStudents = mockStudents.filter((student: any) => 
      !deletedStudents.includes(student.id.toString())
    );
    
    const allStudents = [...mockStudents, ...semesterUploadedStudents];
    setStudents(allStudents);
  }, [semId, currentDepartment]);

  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString().includes(searchQuery)
  );

  const handleLogout = () => {
    // Clear department info on logout
    localStorage.removeItem('currentDepartment');
    localStorage.removeItem('departmentName');
    navigate('/');
  };

  const handleSelectSemester = (semester: string) => {
    navigate(`/semester/${semester}`);
  };

  const handleStudentClick = (studentId: number) => {
    navigate(`/student/${semId}/${studentId}`);
  };

  const handleStudentsUploaded = (newStudents: any[]) => {
    setStudents(prevStudents => [...prevStudents, ...newStudents]);
    setShowUpload(false);
  };

  const handlePrintSemester = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const departmentName = localStorage.getItem('departmentName') || 'Department';
      const avgGPA = (students.reduce((sum, student) => sum + parseFloat(student.gpa), 0) / students.length).toFixed(1);
      const avgAttendance = Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Semester ${semId} Analytics - ${departmentName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .summary-card { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Semester ${semId} Analytics Report</h1>
            <h2>${departmentName}</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <div class="summary-card">
              <h3>Total Students</h3>
              <p style="font-size: 24px; font-weight: bold;">${students.length}</p>
            </div>
            <div class="summary-card">
              <h3>Average GPA</h3>
              <p style="font-size: 24px; font-weight: bold;">${avgGPA}</p>
            </div>
            <div class="summary-card">
              <h3>Average Attendance</h3>
              <p style="font-size: 24px; font-weight: bold;">${avgAttendance}%</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>GPA</th>
                <th>Attendance</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(student => `
                <tr>
                  <td>${student.id}</td>
                  <td>${student.name}</td>
                  <td>${student.gpa}</td>
                  <td>${student.attendance}%</td>
                  <td>${student.improvement >= 0 ? '+' : ''}${student.improvement}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmailSemester = () => {
    const departmentName = localStorage.getItem('departmentName') || 'Department';
    const avgGPA = (students.reduce((sum, student) => sum + parseFloat(student.gpa), 0) / students.length).toFixed(1);
    const avgAttendance = Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length);
    
    const subject = `Semester ${semId} Analytics - ${departmentName}`;
    const body = `Semester ${semId} Analytics Report for ${departmentName}%0D%0A%0D%0A` +
      `Total Students: ${students.length}%0D%0A` +
      `Average GPA: ${avgGPA}/10.0%0D%0A` +
      `Average Attendance: ${avgAttendance}%%0D%0A%0D%0A` +
      `This report was generated on ${new Date().toLocaleDateString()}.%0D%0A%0D%0A` +
      `Generated by BTech Student Analytics System`;
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const getTopPerformers = () => {
    return [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
  };

  const getImprovingStudents = () => {
    return [...students].sort((a, b) => b.improvement - a.improvement).slice(0, 5);
  };

  const getStruggling = () => {
    return [...students].sort((a, b) => a.gpa - b.gpa).slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomHeader onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Semester {semId}</h1>
            <p className="text-gray-600">Total Students: {students.length}</p>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <Button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Students
            </Button>
            <Button onClick={handleEmailSemester} variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Analytics
            </Button>
            <Button onClick={handlePrintSemester} variant="outline" className="flex items-center gap-2">
              <Print className="w-4 h-4" />
              Print Analytics
            </Button>
            <SemesterSelector onSelectSemester={handleSelectSemester} currentSemester={semId} />
          </div>
        </div>

        {showUpload && (
          <div className="mb-6 flex justify-center">
            <ExcelUpload 
              onStudentsUploaded={handleStudentsUploaded}
              currentDepartment={currentDepartment || 'cse'}
            />
          </div>
        )}
        
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 h-auto">
            <TabsTrigger value="all" className="py-2">All Students</TabsTrigger>
            <TabsTrigger value="top" className="py-2">Top Performers</TabsTrigger>
            <TabsTrigger value="improving" className="py-2">Improving</TabsTrigger>
            <TabsTrigger value="struggling" className="py-2">Struggling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <StudentCard 
                    key={student.id} 
                    student={student}
                    onClick={() => handleStudentClick(student.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No students found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="top" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getTopPerformers().map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  onClick={() => handleStudentClick(student.id)}
                  highlight="top"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="improving" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getImprovingStudents().map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  onClick={() => handleStudentClick(student.id)}
                  highlight="improving"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="struggling" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getStruggling().map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  onClick={() => handleStudentClick(student.id)}
                  highlight="struggling"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Semester;
