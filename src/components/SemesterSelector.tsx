
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SemesterSelectorProps {
  onSelectSemester: (semester: string) => void;
  currentSemester?: string | null;
}

const SemesterSelector = ({ onSelectSemester, currentSemester = null }: SemesterSelectorProps) => {
  // Create array of semesters for a BTech program (8 semesters)
  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  return (
    <div className="flex items-center">
      <span className="mr-2 text-gray-700">Select Semester:</span>
      <Select
        defaultValue={currentSemester || undefined}
        onValueChange={onSelectSemester}
      >
        <SelectTrigger className="w-32 border-gray-300">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          {semesters.map((sem) => (
            <SelectItem key={sem} value={sem}>
              Semester {sem}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SemesterSelector;
