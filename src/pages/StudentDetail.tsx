import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { generateStudentDetail } from '@/lib/mock-data';

const StudentDetail = () => {
  const { semId, studentId } = useParams<{ semId: string, studentId: string }>();
  const [student, setStudent] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (semId && studentId) {
      // Generate mock data for this specific student
      const studentData = generateStudentDetail(semId, studentId);
      setStudent(studentData);
    }
  }, [semId, studentId]);

  const handleBack = () => {
    navigate(`/semester/${semId}`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student?.name}? This action cannot be undone.`)) {
      // Store deleted student ID in localStorage
      const deletedStudents = JSON.parse(localStorage.getItem('deletedStudents') || '[]');
      deletedStudents.push(studentId);
      localStorage.setItem('deletedStudents', JSON.stringify(deletedStudents));
      
      toast.success(`${student?.name} has been deleted successfully`);
      navigate(`/semester/${semId}`);
    }
  };

  const handleEmail = () => {
    if (student) {
      const subject = `Student Report - ${student.name}`;
      const body = `Student Report for ${student.name} (ID: ${student.id})%0D%0A%0D%0A` +
        `Current GPA: ${student.gpa.toFixed(1)}/10.0%0D%0A` +
        `Attendance: ${student.attendance}%%0D%0A` +
        `Department: ${student.department}%0D%0A%0D%0A` +
        `This is an automated report from BTech Student Analytics System.`;
      
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  const handlePrint = () => {
    // Create a print-friendly version of the student data
    const printWindow = window.open('', '_blank');
    if (printWindow && student) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Student Report - ${student.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .flex { display: flex; justify-content: space-between; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .highlight { background-color: #e8f4fd; padding: 10px; border-radius: 5px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Academic Report</h1>
            <h2>${student.name} (ID: ${student.id})</h2>
            <p>Semester ${semId} | Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Academic Summary</h3>
            <div class="grid">
              <div class="highlight">
                <strong>Current GPA:</strong> ${student.gpa.toFixed(1)}/10.0
              </div>
              <div class="highlight">
                <strong>Attendance:</strong> ${student.attendance}%
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Current Semester Subjects</h3>
            <table>
              <thead>
                <tr><th>Subject</th><th>Marks</th><th>Class Average</th></tr>
              </thead>
              <tbody>
                ${student.subjects.map((subject: any) => `
                  <tr>
                    <td>${subject.name}</td>
                    <td>${subject.marks}/100</td>
                    <td>${subject.average}/100</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Semester History</h3>
            <table>
              <thead>
                <tr><th>Semester</th><th>GPA</th><th>Attendance</th><th>Rank</th></tr>
              </thead>
              <tbody>
                ${student.semesterHistory.map((sem: any) => `
                  <tr>
                    <td>${sem.name}</td>
                    <td>${sem.gpa.toFixed(1)}</td>
                    <td>${sem.attendance}%</td>
                    <td>${sem.rank}/${sem.totalStudents}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <div class="grid">
              <div>
                <h3>Strengths</h3>
                <ul>
                  ${student.strengths.map((strength: string) => `<li>${strength}</li>`).join('')}
                </ul>
              </div>
              <div>
                <h3>Areas for Improvement</h3>
                <ul>
                  ${student.weaknesses.map((weakness: string) => `<li>${weakness}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="section" style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
            <p>This report was generated by BTech Student Analytics System</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <Button
          onClick={handleBack}
          variant="outline"
          className="mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Semester {semId}
        </Button>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-6">
              <span className="text-3xl font-bold text-blue-500">
                {student.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
              <div className="flex items-center text-gray-600">
                <span>ID: {student.id}</span>
                <span className="mx-2">•</span>
                <span>Semester {semId}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  student.gpa >= 8.5 ? 'bg-green-100 text-green-800' : 
                  student.gpa >= 7.5 ? 'bg-blue-100 text-blue-800' : 
                  student.gpa >= 6.5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  GPA: {student.gpa.toFixed(1)}
                </span>
                <span className={`ml-2 text-sm ${student.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {student.improvement >= 0 ? '+' : ''}{student.improvement.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center" onClick={handleEmail}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Student
            </Button>
            <Button variant="outline" className="flex items-center" onClick={handlePrint}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </Button>
            <Button variant="destructive" className="flex items-center" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Student
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="stat-card border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Current GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.gpa.toFixed(1)}</div>
              <div className="w-full mt-2">
                <div className="progress-container">
                  <div 
                    className={`progress-bar ${
                      student.gpa >= 8.5 ? 'progress-excellent' : 
                      student.gpa >= 7.5 ? 'progress-good' : 
                      student.gpa >= 6.5 ? 'progress-average' : 
                      'progress-poor'
                    }`} 
                    style={{ width: `${(student.gpa / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.attendance}%</div>
              <div className="w-full mt-2">
                <div className="progress-container">
                  <div 
                    className={`progress-bar ${
                      student.attendance >= 90 ? 'progress-excellent' : 
                      student.attendance >= 80 ? 'progress-good' : 
                      student.attendance >= 70 ? 'progress-average' : 
                      'progress-poor'
                    }`} 
                    style={{ width: `${student.attendance}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={student.improvement >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {student.improvement >= 0 ? '+' : ''}{student.improvement.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500">From previous semester</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="subjects" className="py-2">Subjects</TabsTrigger>
            <TabsTrigger value="semesters" className="py-2">Semester History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={student.semesterHistory}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="gpa" name="GPA" stroke="#3b82f6" fill="#93c5fd" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={student.subjects}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar name="Marks" dataKey="marks" fill="#3b82f6" />
                    <Bar name="Class Average" dataKey="average" fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Strengths & Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Strengths</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {student.strengths.map((strength: string, idx: number) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Areas for Improvement</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {student.weaknesses.map((weakness: string, idx: number) => (
                          <li key={idx}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attendance Details</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={student.attendanceHistory}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#22c55e" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="semesters" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {student.semesterHistory.map((semester: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{semester.name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        semester.gpa >= 8.5 ? 'bg-green-100 text-green-800' : 
                        semester.gpa >= 7.5 ? 'bg-blue-100 text-blue-800' : 
                        semester.gpa >= 6.5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        GPA: {semester.gpa.toFixed(1)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Subject Marks</h3>
                        <div className="space-y-3">
                          {semester.subjects.map((subject: any, subIdx: number) => (
                            <div key={subIdx}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-700">{subject.name}</span>
                                <span className="font-medium">{subject.marks}/100</span>
                              </div>
                              <div className="progress-container">
                                <div 
                                  className={`progress-bar ${
                                    subject.marks >= 90 ? 'progress-excellent' : 
                                    subject.marks >= 75 ? 'progress-good' : 
                                    subject.marks >= 60 ? 'progress-average' : 
                                    'progress-poor'
                                  }`} 
                                  style={{ width: `${subject.marks}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Attendance: {semester.attendance}%</span>
                        <span>Rank: {semester.rank}/{semester.totalStudents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDetail;
