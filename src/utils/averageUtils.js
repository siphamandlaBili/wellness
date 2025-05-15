export const calculateAverageBloodPressure = (patients) => {
  const total = patients.reduce(
    (acc, p) => {
      const [systolic, diastolic] = p.medicalInfo?.bloodPressure
        ?.split("/")
        .map(Number) || [0, 0];
      acc.systolic += systolic;
      acc.diastolic += diastolic;
      acc.count++;
      return acc;
    },
    { systolic: 0, diastolic: 0, count: 0 }
  );

  if (total.count === 0) return "N/A";
  return `${Math.round(total.systolic / total.count)}/${Math.round(
    total.diastolic / total.count
  )}`;
};

export const calculateAverageBmi = (patients) => {
  const total = patients.reduce(
    (acc, p) => {
      const bmi = p.medicalInfo?.bmi || 0;
      acc.sum += bmi;
      acc.count++;
      return acc;
    },
    { sum: 0, count: 0 }
  );

  if (total.count === 0) return "N/A";
  return (total.sum / total.count).toFixed(1);
};

export const calculateAverageCholesterol = (patients) => {
  const total = patients.reduce(
    (acc, p) => {
      const cholesterol = p.medicalInfo?.cholesterol || 0;
      acc.sum += cholesterol;
      acc.count++;
      return acc;
    },
    { sum: 0, count: 0 }
  );

  if (total.count === 0) return "N/A";
  return (total.sum / total.count).toFixed(1);
};

export const calculateAverageHba1c = (patients) => {
  const total = patients.reduce(
    (acc, p) => {
      const hba1c = p.medicalInfo?.hba1c || 0;
      acc.sum += hba1c;
      acc.count++;
      return acc;
    },
    { sum: 0, count: 0 }
  );

  if (total.count === 0) return "N/A";
  return (total.sum / total.count).toFixed(1);
};

export const calculateAverageGlucose = (patients) => {
  const total = patients.reduce(
    (acc, p) => {
      const glucose = p.medicalInfo?.glucose || 0;
      acc.sum += glucose;
      acc.count++;
      return acc;
    },
    { sum: 0, count: 0 }
  );

  if (total.count === 0) return "N/A";
  return (total.sum / total.count).toFixed(1);
};
