
import React from 'react';
import Header from './Header';
import DepartmentBadge from './DepartmentBadge';
import { useAuth } from '@/App';

interface CustomHeaderProps {
  onLogout: () => void;
}

const CustomHeader = ({ onLogout }: CustomHeaderProps) => {
  const { departmentName } = useAuth();

  return (
    <div className="relative">
      <Header onLogout={onLogout} />
      {departmentName && (
        <div className="absolute top-0 right-4 transform mt-4">
          <DepartmentBadge />
        </div>
      )}
    </div>
  );
};

export default CustomHeader;
