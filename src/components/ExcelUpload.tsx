
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  onStudentsUploaded: (students: any[]) => void;
  currentDepartment: string;
  currentSemester?: string;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onStudentsUploaded, currentDepartment, currentSemester = '1' }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Excel data parsed:', jsonData);
        console.log('Current semester:', currentSemester);
        console.log('Current department:', currentDepartment);

        // Process the Excel data with better name handling
        const processedStudents = jsonData.map((row: any, index: number) => {
          // Handle different possible column names and preserve exact name
          const studentName = row.Name || row.name || row.StudentName || row['Student Name'] || row.NAME || `Student ${index + 1}`;
          const studentId = row.ID || row.id || row.StudentID || row['Student ID'] || row.Id || (Date.now() + index);
          
          const student = {
            id: parseInt(studentId.toString()) || Date.now() + index,
            name: studentName.toString().trim(), // Ensure it's a string and trim whitespace
            gpa: parseFloat(row.GPA || row.gpa || row.Gpa || (Math.random() * 3 + 7).toFixed(1)),
            attendance: parseInt(row.Attendance || row.attendance || row.ATTENDANCE || Math.floor(Math.random() * 30 + 70)),
            improvement: parseFloat(row.Improvement || row.improvement || row.IMPROVEMENT || (Math.random() * 10 - 5).toFixed(1)),
            semester: currentSemester,
            department: currentDepartment
          };
          
          console.log('Original row data:', row);
          console.log('Processed student:', student);
          return student;
        });

        // Store in localStorage
        const existingStudents = JSON.parse(localStorage.getItem('uploadedStudents') || '[]');
        const updatedStudents = [...existingStudents, ...processedStudents];
        localStorage.setItem('uploadedStudents', JSON.stringify(updatedStudents));

        console.log('Updated localStorage with students:', updatedStudents);

        onStudentsUploaded(processedStudents);
        toast.success(`Successfully uploaded ${processedStudents.length} students`);
        
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast.error('Error processing Excel file. Please check the format.');
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        ID: 12345,
        Name: 'John Doe',
        GPA: 8.5,
        Attendance: 95,
        Improvement: 2.3,
        Semester: parseInt(currentSemester)
      },
      {
        ID: 12346,
        Name: 'Jane Smith',
        GPA: 7.8,
        Attendance: 87,
        Improvement: -1.2,
        Semester: parseInt(currentSemester)
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'student_template.xlsx');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Upload Student Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Upload an Excel file with student information. Required columns: ID, Name, GPA, Attendance, Improvement, Semester.
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Template
          </Button>
          
          <Button
            onClick={handleUploadClick}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Excel File
              </>
            )}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default ExcelUpload;
