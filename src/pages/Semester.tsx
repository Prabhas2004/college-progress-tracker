
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import StudentCard from '@/components/StudentCard';
import SemesterSelector from '@/components/SemesterSelector';
import { generateMockStudents } from '@/lib/mock-data';

const Semester = () => {
  const { semId } = useParams<{ semId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate mock students based on semester
    const mockStudents = generateMockStudents(semId || '1');
    setStudents(mockStudents);
  }, [semId]);

  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString().includes(searchQuery)
  );

  const handleLogout = () => {
    navigate('/');
  };

  const handleSelectSemester = (semester: string) => {
    navigate(`/semester/${semester}`);
  };

  const handleStudentClick = (studentId: number) => {
    navigate(`/student/${semId}/${studentId}`);
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
      <Header onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Semester {semId}</h1>
            <p className="text-gray-600">Total Students: {students.length}</p>
          </div>
          <SemesterSelector onSelectSemester={handleSelectSemester} currentSemester={semId} />
        </div>
        
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
