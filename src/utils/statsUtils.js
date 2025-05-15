// filepath: /Users/cwengagosa/Desktop/FMP Wellness/wellness/src/utils/statsUtils.js

export const calculateBloodPressureStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const [systolic, diastolic] = p.medicalInfo?.bloodPressure
        ?.split("/")
        .map(Number) || [0, 0];
      if (systolic < 120 && diastolic < 80) acc.normal++;
      else if (systolic < 139 && diastolic < 89) acc.elevated++;
      else acc.high++;
      return acc;
    },
    { normal: 0, elevated: 0, high: 0 }
  );
};

export const calculateBmiStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const bmi = p.medicalInfo?.bmi;
      if (bmi < 18.5) acc.underweight++;
      else if (bmi < 25) acc.normal++;
      else if (bmi < 30) acc.overweight++;
      else acc.obese++;
      return acc;
    },
    { underweight: 0, normal: 0, overweight: 0, obese: 0 }
  );
};

export const calculateHba1cStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const val = parseFloat(p.medicalInfo?.hba1c);
      if (val < 5.7) acc.normal++;
      else if (val < 6.5) acc.prediabetes++;
      else acc.diabetes++;
      return acc;
    },
    { normal: 0, prediabetes: 0, diabetes: 0 }
  );
};

export const calculateCholesterolStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const cholesterol = p.medicalInfo?.cholesterol || 0;
      if (cholesterol < 200) acc.normal++;
      else if (cholesterol < 240) acc.borderline++;
      else acc.high++;
      return acc;
    },
    { normal: 0, borderline: 0, high: 0 }
  );
};

export const calculateHivStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const hivStatus = p.medicalInfo?.hiv || "Unknown";
      if (hivStatus === "Negative") acc.negative++;
      else if (hivStatus === "Positive") acc.positive++;
      else if (hivStatus === "Inconclusive") acc.inconclusive++;
      else acc.unknown++;
      return acc;
    },
    { negative: 0, positive: 0, inconclusive: 0, unknown: 0 }
  );
};

export const calculateGlucoseStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const glucoseType = p.medicalInfo?.glucoseType || "Unknown";
      if (glucoseType === "Fasting") acc.fasting++;
      else if (glucoseType === "Random") acc.random++;
      else if (glucoseType === "Postprandial") acc.postprandial++;
      else acc.unknown++;
      return acc;
    },
    { fasting: 0, random: 0, postprandial: 0, unknown: 0 }
  );
};

export const calculateSexStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const sex = p.medicalInfo?.sex || "Unknown";
      if (sex === "Male") acc.male++;
      else if (sex === "Female") acc.female++;
      else acc.unknown++;
      return acc;
    },
    { male: 0, female: 0, unknown: 0 }
  );
};

export const calculateAgeStats = (patients) => {
  return patients.reduce(
    (acc, p) => {
      const age = p.medicalInfo?.age || 0;
      if (age >= 18 && age < 40) acc.adults++;
      else if (age < 60) acc.middleAged++;
      else if (age >= 60) acc.seniors++;
      return acc;
    },
    { adults: 0, middleAged: 0, seniors: 0 }
  );
};
