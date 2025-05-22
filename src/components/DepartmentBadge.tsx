
import React from 'react';
import { useAuth } from '@/App';
import { Badge } from '@/components/ui/badge';

const DepartmentBadge = () => {
  const { departmentName, currentDepartment } = useAuth();
  
  if (!departmentName || !currentDepartment) return null;

  // Colors based on department
  const colors = {
    cse: "bg-blue-500 hover:bg-blue-600",
    ds: "bg-green-500 hover:bg-green-600",
    aiml: "bg-purple-500 hover:bg-purple-600",
    civil: "bg-yellow-500 hover:bg-yellow-600",
    ise: "bg-red-500 hover:bg-red-600",
    admin: "bg-gray-700 hover:bg-gray-800",
  };

  const badgeColor = colors[currentDepartment as keyof typeof colors] || "bg-blue-500 hover:bg-blue-600";

  return (
    <Badge className={`${badgeColor} text-white`}>
      {departmentName}
    </Badge>
  );
};

export default DepartmentBadge;
