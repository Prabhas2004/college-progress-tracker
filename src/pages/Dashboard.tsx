
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SemesterSelector from '@/components/SemesterSelector';
import Header from '@/components/Header';

// Mock Data
const overallStats = {
  totalStudents: 325,
  avgGPA: 7.8,
  topPerformer: 'Aditya Sharma',
  improvement: '+4.7%'
};

const attendanceData = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 87 },
  { month: 'Mar', attendance: 91 },
  { month: 'Apr', attendance: 85 },
  { month: 'May', attendance: 94 },
  { month: 'Jun', attendance: 89 },
];

const performanceData = [
  { subject: 'Mathematics', avg: 78, topScore: 98 },
  { subject: 'Physics', avg: 72, topScore: 95 },
  { subject: 'Chemistry', avg: 75, topScore: 92 },
  { subject: 'Computer Science', avg: 82, topScore: 100 },
  { subject: 'English', avg: 80, topScore: 96 },
];

const gradeDistribution = [
  { name: 'A', value: 25, color: '#22c55e' },
  { name: 'B', value: 35, color: '#3b82f6' },
  { name: 'C', value: 30, color: '#eab308' },
  { name: 'D', value: 10, color: '#ef4444' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  
  // Redirect to specific semester page when selected
  useEffect(() => {
    if (selectedSemester) {
      navigate(`/semester/${selectedSemester}`);
    }
  }, [selectedSemester, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Student Analytics Dashboard</h1>
          <SemesterSelector onSelectSemester={setSelectedSemester} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="stat-card border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
              <p className="text-xs text-gray-500">Across all semesters</p>
            </CardContent>
          </Card>
          <Card className="stat-card border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.avgGPA}</div>
              <p className="text-xs text-gray-500">Out of 10.0</p>
            </CardContent>
          </Card>
          <Card className="stat-card border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.topPerformer}</div>
              <p className="text-xs text-gray-500">9.8 GPA</p>
            </CardContent>
          </Card>
          <Card className="stat-card border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Overall Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{overallStats.improvement}</div>
              <p className="text-xs text-gray-500">From last semester</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="attendance" className="py-2">Attendance</TabsTrigger>
            <TabsTrigger value="performance" className="py-2">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Semester Performance Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: 'Sem 1', gpa: 7.1 },
                        { name: 'Sem 2', gpa: 7.4 },
                        { name: 'Sem 3', gpa: 7.2 },
                        { name: 'Sem 4', gpa: 7.6 },
                        { name: 'Sem 5', gpa: 7.8 },
                        { name: 'Sem 6', gpa: 8.2 },
                        { name: 'Sem 7', gpa: 8.1 },
                        { name: 'Sem 8', gpa: 8.4 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[6, 10]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="gpa" stroke="#3b82f6" fill="#93c5fd" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={attendanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="attendance" stroke="#22c55e" fill="#bbf7d0" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg" name="Class Average" fill="#3b82f6" />
                    <Bar dataKey="topScore" name="Top Score" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
