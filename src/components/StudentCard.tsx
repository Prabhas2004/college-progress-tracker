
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StudentProps {
  student: {
    id: number;
    name: string;
    gpa: number;
    attendance: number;
    improvement: number;
  };
  onClick: () => void;
  highlight?: 'top' | 'improving' | 'struggling' | null;
}

const StudentCard = ({ student, onClick, highlight = null }: StudentProps) => {
  let borderColor = '';
  
  if (highlight === 'top') {
    borderColor = 'border-t-4 border-t-green-500';
  } else if (highlight === 'improving') {
    borderColor = 'border-t-4 border-t-blue-500';
  } else if (highlight === 'struggling') {
    borderColor = 'border-t-4 border-t-red-500';
  }

  return (
    <Card 
      className={`student-card hover:scale-105 transition-transform ${borderColor}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="font-bold text-blue-600">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-500">ID: {student.id}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">GPA</span>
              <span className={`text-sm font-medium ${
                student.gpa >= 8.5 ? 'text-green-600' : 
                student.gpa >= 7.5 ? 'text-blue-600' : 
                student.gpa >= 6.5 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {student.gpa.toFixed(1)}
              </span>
            </div>
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
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Attendance</span>
              <span className="text-sm font-medium">{student.attendance}%</span>
            </div>
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
        </div>
        
        <div className="mt-3 text-right">
          <span className={`text-xs ${student.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {student.improvement >= 0 ? '+' : ''}{student.improvement.toFixed(1)}% from last sem
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
