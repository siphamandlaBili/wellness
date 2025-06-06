export const dummyPatients = [
  {
    id: "1",
    personalInfo: {
      fullName: "Jane Doe",
      surname: "Smith",
      dateOfBirth: "1990-01-01",
      idNumber: "123456789",
      email: "jane.doe@example.com",
      cellPhone: "123-456-7890",
      sex: "Female",
    },
    medicalInfo: {
      height: 165,
      weight: 70,
      bmi: 25.7,
      cholesterol: 190,
      hba1c: 5.8,
      glucose: 6.2,
      bloodPressure: "120/80",
      hiv: "Negative",
      glucoseType: "Fasting",
    },
    medicalAidDetails: {
      schemeName: "HealthCare Plus",
      planOption: "Gold",
      membershipNumber: "HC12345",
      mainMemberNames: "John Doe",
      mainMemberAddress: "123 Health Street, Wellness City",
      dependentCode: "01",
    },
    mentalHealthAssessment: [
      { question: "How often do you feel anxious?", answer: "Rarely" },
      { question: "Do you have trouble sleeping?", answer: "Sometimes" },
    ],
  },
  {
    id: "2",
    personalInfo: {
      fullName: "John Smith",
      surname: "Doe",
      dateOfBirth: "1985-05-15",
      idNumber: "987654321",
      email: "john.smith@example.com",
      cellPhone: "987-654-3210",
      sex: "Male",
    },
    medicalInfo: {
      height: 180,
      weight: 85,
      bmi: 26.2,
      cholesterol: 210,
      hba1c: 6.1,
      glucose: 7.0,
      bloodPressure: "130/85",
      hiv: "Negative",
      glucoseType: "Random",
    },
    medicalAidDetails: {
      schemeName: "Wellness Care",
      planOption: "Silver",
      membershipNumber: "WC98765",
      mainMemberNames: "Jane Smith",
      mainMemberAddress: "456 Wellness Avenue, Health City",
      dependentCode: "02",
    },
    mentalHealthAssessment: [
      { question: "How often do you feel anxious?", answer: "Often" },
      { question: "Do you have trouble sleeping?", answer: "Rarely" },
    ],
  },
  {
    id: "3",
    personalInfo: {
      fullName: "Alice Johnson",
      surname: "Brown",
      dateOfBirth: "1975-03-22",
      idNumber: "456789123",
      email: "alice.johnson@example.com",
      cellPhone: "456-789-1234",
      sex: "Female",
    },
    medicalInfo: {
      height: 160,
      weight: 60,
      bmi: 23.4,
      cholesterol: 180,
      hba1c: 5.5,
      glucose: 5.8,
      bloodPressure: "110/70",
      hiv: "Negative",
      glucoseType: "Fasting",
    },
    medicalAidDetails: {
      schemeName: "HealthCare Basic",
      planOption: "Bronze",
      membershipNumber: "HC45678",
      mainMemberNames: "Alice Johnson",
      mainMemberAddress: "789 Wellness Lane, Health City",
      dependentCode: "03",
    },
    mentalHealthAssessment: [
      { question: "How often do you feel anxious?", answer: "Sometimes" },
      { question: "Do you have trouble sleeping?", answer: "Often" },
    ],
  },
  {
    id: "4",
    personalInfo: {
      fullName: "Bob Williams",
      surname: "Taylor",
      dateOfBirth: "1965-07-10",
      idNumber: "789123456",
      email: "bob.williams@example.com",
      cellPhone: "789-123-4567",
      sex: "Male",
    },
    medicalInfo: {
      height: 175,
      weight: 95,
      bmi: 31.0,
      cholesterol: 250,
      hba1c: 7.2,
      glucose: 8.5,
      bloodPressure: "140/90",
      hiv: "Negative",
      glucoseType: "Postprandial",
    },
    medicalAidDetails: {
      schemeName: "Wellness Premium",
      planOption: "Platinum",
      membershipNumber: "WP78912",
      mainMemberNames: "Bob Williams",
      mainMemberAddress: "123 Premium Street, Health City",
      dependentCode: "04",
    },
    mentalHealthAssessment: [
      { question: "How often do you feel anxious?", answer: "Often" },
      { question: "Do you have trouble sleeping?", answer: "Rarely" },
    ],
  },
  {
    id: "5",
    personalInfo: {
      fullName: "Charlie Davis",
      surname: "Green",
      dateOfBirth: "2000-11-05",
      idNumber: "321654987",
      email: "charlie.davis@example.com",
      cellPhone: "321-654-9870",
      sex: "Male",
    },
    medicalInfo: {
      height: 170,
      weight: 75,
      bmi: 25.9,
      cholesterol: 200,
      hba1c: 6.0,
      glucose: 6.5,
      bloodPressure: "125/80",
      hiv: "Positive",
      glucoseType: "Random",
    },
    medicalAidDetails: {
      schemeName: "HealthCare Plus",
      planOption: "Gold",
      membershipNumber: "HC32165",
      mainMemberNames: "Charlie Davis",
      mainMemberAddress: "654 Health Avenue, Wellness City",
      dependentCode: "05",
    },
    mentalHealthAssessment: [
      { question: "How often do you feel anxious?", answer: "Rarely" },
      { question: "Do you have trouble sleeping?", answer: "Sometimes" },
    ],
  },
];

// Exporting a single event
export const eventDetails = {
  eventType: "Health Screening",
  eventName: "Wellness Day 2025",
  eventDate: "2025-06-15",
  venue: "Wellness Center, Main Hall",
  company: "HealthCare Plus",
};
