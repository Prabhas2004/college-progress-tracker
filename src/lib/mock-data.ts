
// Generate mock data for the student analytics dashboard

// Helper function to generate a random number within a range
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to generate a random name
const generateName = (): string => {
  const firstNames = [
    'Aditya', 'Aarav', 'Aryan', 'Vivaan', 'Vihaan', 
    'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Aadhya',
    'Rohan', 'Rahul', 'Arjun', 'Ishaan', 'Dhruv',
    'Neha', 'Priya', 'Riya', 'Nisha', 'Shreya',
    'Vikram', 'Karan', 'Virat', 'Raj', 'Dev',
    'Kavya', 'Anjali', 'Pooja', 'Meera', 'Aditi'
  ];
  
  const lastNames = [
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 
    'Shah', 'Mehta', 'Verma', 'Joshi', 'Agarwal',
    'Reddy', 'Nair', 'Iyer', 'Pillai', 'Menon',
    'Das', 'Chatterjee', 'Banerjee', 'Mukherjee', 'Roy',
    'Kapoor', 'Malhotra', 'Khanna', 'Bhatia', 'Chopra'
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Generate a list of students for a semester
export const generateMockStudents = (semesterId: string): any[] => {
  const semNumber = parseInt(semesterId);
  const studentCount = randomBetween(30, 50);
  
  const students = Array.from({ length: studentCount }, (_, i) => {
    const studentId = (semNumber * 1000) + (i + 1);
    const gpa = 6 + (Math.random() * 4); // GPA between 6.0 and 10.0
    const attendance = randomBetween(70, 98);
    // Higher semester students generally have better improvement trends
    const improvementBase = semNumber >= 4 ? 5 : 0;
    const improvement = (Math.random() * 10) - 3 + improvementBase; // Between -3% and +7-12%
    
    return {
      id: studentId,
      name: generateName(),
      gpa,
      attendance,
      improvement
    };
  });
  
  return students;
};

// Generate subjects for BTech curriculum
const generateSubjects = (semesterId: string): any[] => {
  // Different subjects based on semester
  const subjectsBySem: Record<string, string[]> = {
    '1': ['Mathematics I', 'Physics', 'Chemistry', 'Basic Electrical Eng.', 'Engineering Graphics'],
    '2': ['Mathematics II', 'Basic Electronics', 'Programming Fundamentals', 'Engineering Mechanics', 'Environmental Science'],
    '3': ['Data Structures', 'Digital Logic Design', 'Discrete Mathematics', 'Computer Organization', 'Object Oriented Programming'],
    '4': ['Database Systems', 'Operating Systems', 'Theory of Computation', 'Computer Networks', 'Software Engineering'],
    '5': ['Algorithm Design', 'Compiler Design', 'Computer Graphics', 'Artificial Intelligence', 'Web Technologies'],
    '6': ['Machine Learning', 'Information Security', 'Cloud Computing', 'Mobile App Development', 'Elective I'],
    '7': ['Distributed Systems', 'Big Data Analytics', 'Internet of Things', 'Elective II', 'Elective III'],
    '8': ['Project Work', 'Industrial Training', 'Professional Ethics', 'Elective IV', 'Elective V']
  };
  
  const subjects = subjectsBySem[semesterId] || subjectsBySem['1'];
  
  return subjects.map(name => {
    const marks = randomBetween(60, 95);
    return {
      name,
      marks,
      average: marks - randomBetween(-5, 10) // Class average slightly lower
    };
  });
};

// Generate attendance history data
const generateAttendanceHistory = (): any[] => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => {
    return {
      month,
      attendance: randomBetween(75, 98)
    };
  });
};

// Generate semester history
const generateSemesterHistory = (currSemId: string, studentGpa: number): any[] => {
  const currSem = parseInt(currSemId);
  const semesters = [];
  
  // Generate history for all previous semesters
  for (let i = 1; i <= currSem; i++) {
    // For current semester, use the student's actual GPA
    // For previous semesters, generate slightly lower GPAs to show improvement trend
    let semGpa = i === currSem ? studentGpa : studentGpa - (0.1 * (currSem - i)) - (Math.random() * 0.3);
    semGpa = Math.max(6.0, Math.min(10.0, semGpa)); // Keep GPA between 6 and 10
    
    semesters.push({
      name: `Semester ${i}`,
      gpa: semGpa,
      attendance: randomBetween(75, 95),
      rank: randomBetween(1, 40),
      totalStudents: randomBetween(40, 50),
      subjects: generateSubjects(i.toString()).map(s => {
        return {
          name: s.name,
          marks: s.marks
        };
      })
    });
  }
  
  return semesters;
};

// Generate strengths and weaknesses
const generateStrengthsWeaknesses = (subjects: any[]): { strengths: string[], weaknesses: string[] } => {
  // Sort subjects by marks
  const sortedSubjects = [...subjects].sort((a, b) => b.marks - a.marks);
  
  // Top 2 subjects are strengths
  const strengths = sortedSubjects.slice(0, 2).map(s => `Strong performance in ${s.name} (${s.marks}%)`);
  strengths.push(
    Math.random() > 0.5 ? 'Consistent attendance record' : 'Good class participation',
    Math.random() > 0.5 ? 'Excellent project work' : 'Strong practical skills'
  );
  
  // Bottom 2 subjects are weaknesses
  const weaknesses = sortedSubjects.slice(-2).map(s => `Needs improvement in ${s.name} (${s.marks}%)`);
  weaknesses.push(
    Math.random() > 0.5 ? 'Could benefit from more practical applications' : 'Should focus on conceptual understanding',
    Math.random() > 0.5 ? 'More consistent study habits recommended' : 'Consider additional practice exercises'
  );
  
  return { strengths, weaknesses };
};

// Generate detailed student data
export const generateStudentDetail = (semesterId: string, studentId: string): any => {
  const semNumber = parseInt(semesterId);
  const id = parseInt(studentId);
  
  // Generate base student data
  const gpa = 6 + (Math.random() * 4); // GPA between 6.0 and 10.0
  const attendance = randomBetween(70, 98);
  const improvement = (Math.random() * 10) - 3 + (semNumber >= 4 ? 5 : 0);
  
  // Generate subjects
  const subjects = generateSubjects(semesterId);
  
  // Generate attendance history
  const attendanceHistory = generateAttendanceHistory();
  
  // Generate semester history
  const semesterHistory = generateSemesterHistory(semesterId, gpa);
  
  // Generate strengths and weaknesses
  const { strengths, weaknesses } = generateStrengthsWeaknesses(subjects);
  
  return {
    id,
    name: generateName(),
    gpa,
    attendance,
    improvement,
    subjects,
    attendanceHistory,
    semesterHistory,
    strengths,
    weaknesses
  };
};

export default {
  generateMockStudents,
  generateStudentDetail
};
