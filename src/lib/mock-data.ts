const names = {
  cse: [
    "Alice", "Bob", "Charlie", "David", "Eve", "Jona", "Kevin", "Liam", "Mia", "Noah",
    "Olivia", "Owen", "Quinn", "Ryan", "Sophia", "Tyler", "Uma", "Victor", "Willow", "Xander",
    "Yara", "Zack", "Ava", "Ben", "Chloe"
  ],
  ds: [
    "Aarav", "Diya", "Ishaan", "Kavya", "Neil", "Priya", "Rohan", "Siya", "Tanvi", "Veer",
    "Zara", "Aryan", "Myra", "Vivaan", "Anika", "Advik", "Ira", "Kabir", "Raina", "Shaurya",
    "Aanya", "Dhruv", "Kiara", "Riyaan", "Shanaya"
  ],
  aiml: [
    "Aaliyah", "Zayn", "Inaya", "Rayan", "Esha", "Vivaan", "Ayaan", "Kiara", "Armaan", "Saanvi",
    "Reyansh", "Anaya", "Aarush", "Pari", "Arnav", "Aaradhya", "Ibrahim", "Aisha", "Zoya", "Omar",
    "Alia", "Bilal", "Hina", "Imran", "Jasmine"
  ],
  civil: [
    "Hazel", "Jasper", "Scarlett", "Finn", "Luna", "Atticus", "Aurora", "Silas", "Cora", "Leo",
    "Violet", "Milo", "Elsie", "Theodore", "Ada", "Oscar", "Ivy", "Felix", "Maisie", "Arthur",
    "Evelyn", "Henry", "Grace", "Owen", "Chloe"
  ],
  ise: [
    "Hazel", "Jasper", "Scarlett", "Finn", "Luna", "Atticus", "Aurora", "Silas", "Cora", "Leo",
    "Violet", "Milo", "Elsie", "Theodore", "Ada", "Oscar", "Ivy", "Felix", "Maisie", "Arthur",
    "Evelyn", "Henry", "Grace", "Owen", "Chloe"
  ],
  admin: [
    "Hazel", "Jasper", "Scarlett", "Finn", "Luna", "Atticus", "Aurora", "Silas", "Cora", "Leo",
    "Violet", "Milo", "Elsie", "Theodore", "Ada", "Oscar", "Ivy", "Felix", "Maisie", "Arthur",
    "Evelyn", "Henry", "Grace", "Owen", "Chloe"
  ]
};

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Hall"
];

const departmentNames = {
  cse: [
    "Alice", "Bob", "Charlie", "David", "Eve", "Jona", "Kevin", "Liam", "Mia", "Noah",
    "Olivia", "Owen", "Quinn", "Ryan", "Sophia", "Tyler", "Uma", "Victor", "Willow", "Xander",
    "Yara", "Zack", "Ava", "Ben", "Chloe"
  ],
  ds: [
    "Aarav", "Diya", "Ishaan", "Kavya", "Neil", "Priya", "Rohan", "Siya", "Tanvi", "Veer",
    "Zara", "Aryan", "Myra", "Vivaan", "Anika", "Advik", "Ira", "Kabir", "Raina", "Shaurya",
    "Aanya", "Dhruv", "Kiara", "Riyaan", "Shanaya"
  ],
  aiml: [
    "Aaliyah", "Zayn", "Inaya", "Rayan", "Esha", "Vivaan", "Ayaan", "Kiara", "Armaan", "Saanvi",
    "Reyansh", "Anaya", "Aarush", "Pari", "Arnav", "Aaradhya", "Ibrahim", "Aisha", "Zoya", "Omar",
    "Alia", "Bilal", "Hina", "Imran", "Jasmine"
  ],
  civil: [
    "Hazel", "Jasper", "Scarlett", "Finn", "Luna", "Atticus", "Aurora", "Silas", "Cora", "Leo",
    "Violet", "Milo", "Elsie", "Theodore", "Ada", "Oscar", "Ivy", "Felix", "Maisie", "Arthur",
    "Evelyn", "Henry", "Grace", "Owen", "Chloe"
  ],
  ise: [
    "Hazel", "Jasper", "Scarlett", "Finn", "Luna", "Atticus", "Aurora", "Silas", "Cora", "Leo",
    "Violet", "Milo", "Elsie", "Theodore", "Ada", "Oscar", "Ivy", "Felix", "Maisie", "Arthur",
    "Evelyn", "Henry", "Grace", "Owen", "Chloe"
  ],
  admin: [
    "Hazel", "Jasper", "Scarlett", "Finn", "Luna", "Atticus", "Aurora", "Silas", "Cora", "Leo",
    "Violet", "Milo", "Elsie", "Theodore", "Ada", "Oscar", "Ivy", "Felix", "Maisie", "Arthur",
    "Evelyn", "Henry", "Grace", "Owen", "Chloe"
  ]
};

export const generateMockStudents = (semesterId: string, department?: string) => {
  const students: any[] = [];
  const deptCode = department || 'cse';
  
  // Use semester and department to create consistent student IDs
  const baseId = parseInt(semesterId) * 1000 + getDepartmentOffset(deptCode);
  
  const names = departmentNames[deptCode as keyof typeof departmentNames] || departmentNames.cse;
  
  for (let i = 0; i < 25; i++) {
    const nameIndex = i % names.length;
    const lastName = lastNames[i % lastNames.length];
    
    students.push({
      id: baseId + i + 1, // Consistent ID generation
      name: `${names[nameIndex]} ${lastName}`,
      gpa: parseFloat((Math.random() * 3 + 7).toFixed(1)),
      attendance: Math.floor(Math.random() * 30 + 70),
      improvement: parseFloat((Math.random() * 10 - 5).toFixed(1)),
      semester: semesterId,
      department: deptCode
    });
  }
  
  return students;
};

// Helper function to get department offset for consistent IDs
const getDepartmentOffset = (department: string): number => {
  const offsets: { [key: string]: number } = {
    'cse': 100,
    'ds': 200,
    'aiml': 300,
    'civil': 400,
    'ise': 500,
    'admin': 600
  };
  return offsets[department] || 100;
};

export const generateStudentDetail = (semesterId: string, studentId: string) => {
  // Parse the student ID to determine department and index
  const id = parseInt(studentId);
  const semesterNum = parseInt(semesterId);
  const baseId = semesterNum * 1000;
  const studentIndex = id - baseId - 1;
  
  // Determine department from ID range
  let department = 'cse';
  const idOffset = id % 1000;
  if (idOffset >= 600) department = 'admin';
  else if (idOffset >= 500) department = 'ise';
  else if (idOffset >= 400) department = 'civil';
  else if (idOffset >= 300) department = 'aiml';
  else if (idOffset >= 200) department = 'ds';
  else if (idOffset >= 100) department = 'cse';
  
  const deptNames = departmentNames[department as keyof typeof departmentNames] || departmentNames.cse;
  const nameIndex = Math.abs(studentIndex) % deptNames.length;
  const lastNameIndex = Math.abs(studentIndex) % lastNames.length;
  const studentName = `${deptNames[nameIndex]} ${lastNames[lastNameIndex]}`;
  
  const currentGPA = parseFloat((Math.random() * 3 + 7).toFixed(1));
  const currentAttendance = Math.floor(Math.random() * 30 + 70);
  
  const student = {
    id: id,
    name: studentName,
    gpa: currentGPA,
    attendance: currentAttendance,
    improvement: parseFloat((Math.random() * 10 - 5).toFixed(1)),
    department: department,
    
    // Generate semester history
    semesterHistory: Array.from({ length: semesterNum }, (_, i) => {
      const semNum = i + 1;
      const gpa = parseFloat((Math.random() * 3 + 6.5).toFixed(1));
      return {
        name: `Semester ${semNum}`,
        gpa: gpa,
        attendance: Math.floor(Math.random() * 20 + 75),
        rank: Math.floor(Math.random() * 50 + 1),
        totalStudents: 150,
        subjects: generateSubjectsForDepartment(department).map(subject => ({
          name: subject,
          marks: Math.floor(Math.random() * 40 + 60)
        }))
      };
    }),
    
    // Generate current semester subjects
    subjects: generateSubjectsForDepartment(department).map(subject => ({
      name: subject,
      marks: Math.floor(Math.random() * 40 + 60),
      average: Math.floor(Math.random() * 20 + 70)
    })),
    
    // Generate attendance history
    attendanceHistory: [
      { month: 'Jan', attendance: Math.floor(Math.random() * 20 + 75) },
      { month: 'Feb', attendance: Math.floor(Math.random() * 20 + 75) },
      { month: 'Mar', attendance: Math.floor(Math.random() * 20 + 75) },
      { month: 'Apr', attendance: Math.floor(Math.random() * 20 + 75) },
      { month: 'May', attendance: currentAttendance }
    ],
    
    strengths: getStrengthsForDepartment(department),
    weaknesses: getWeaknessesForDepartment(department)
  };
  
  return student;
};

// Helper functions for department-specific data
const generateSubjectsForDepartment = (department: string): string[] => {
  const subjects: { [key: string]: string[] } = {
    cse: ['Data Structures', 'Algorithms', 'Database Systems', 'Computer Networks', 'Software Engineering'],
    ds: ['Statistics', 'Machine Learning', 'Data Mining', 'Python Programming', 'Data Visualization'],
    aiml: ['Neural Networks', 'Deep Learning', 'Computer Vision', 'NLP', 'Reinforcement Learning'],
    civil: ['Structural Engineering', 'Concrete Technology', 'Surveying', 'Transportation', 'Geotechnical'],
    ise: ['System Analysis', 'Web Technologies', 'Mobile Computing', 'Cloud Computing', 'Cybersecurity'],
    admin: ['Management', 'Finance', 'Marketing', 'Operations', 'Strategy']
  };
  return subjects[department] || subjects.cse;
};

const getStrengthsForDepartment = (department: string): string[] => {
  const strengths: { [key: string]: string[] } = {
    cse: ['Problem Solving', 'Programming Logic', 'Algorithm Design'],
    ds: ['Statistical Analysis', 'Data Interpretation', 'Mathematical Modeling'],
    aiml: ['Pattern Recognition', 'Model Implementation', 'Research Skills'],
    civil: ['Technical Drawing', 'Project Management', 'Field Work'],
    ise: ['System Design', 'User Experience', 'Technical Documentation'],
    admin: ['Leadership', 'Communication', 'Strategic Thinking']
  };
  return strengths[department] || strengths.cse;
};

const getWeaknessesForDepartment = (department: string): string[] => {
  const weaknesses: { [key: string]: string[] } = {
    cse: ['Code Optimization', 'Documentation', 'Testing'],
    ds: ['Data Cleaning', 'Visualization', 'Presentation'],
    aiml: ['Feature Engineering', 'Model Tuning', 'Deployment'],
    civil: ['CAD Software', 'Cost Estimation', 'Environmental Impact'],
    ise: ['Database Design', 'Security Implementation', 'Performance Optimization'],
    admin: ['Data Analysis', 'Digital Tools', 'Process Automation']
  };
  return weaknesses[department] || weaknesses.cse;
};
