export const patients = [
  {
    id: "P-1043",
    name: "Arjun Sharma",
    ward: "ICU-A",
    age: 64,
    labTest: "CBC, Lipid Panel",
    labTests: [
      { id: "LT-1", name: "CBC", status: "Pending", pdfFilename: null, pdfData: null },
      { id: "LT-2", name: "Lipid Panel", status: "Pending", pdfFilename: null, pdfData: null },
    ],
    hospitalCode: "CITYHOSP01",
  },
  {
    id: "P-1044",
    name: "Meera Iyer",
    ward: "ICU-A",
    age: 71,
    labTest: "CRP, ECG Study",
    labTests: [
      { id: "LT-3", name: "CRP", status: "Pending", pdfFilename: null, pdfData: null },
      { id: "LT-4", name: "ECG Study", status: "Pending", pdfFilename: null, pdfData: null },
    ],
    hospitalCode: "CITYHOSP01",
  },
  {
    id: "P-1045",
    name: "Vikram Reddy",
    ward: "ICU-B",
    age: 58,
    labTest: "Urinalysis",
    labTests: [
      { id: "LT-5", name: "Urinalysis", status: "Pending", pdfFilename: null, pdfData: null },
    ],
    hospitalCode: "CITYHOSP01",
  },
  {
    id: "P-1046",
    name: "Priya Nair",
    ward: "POST-OP",
    age: 45,
    labTest: "Blood Sugar",
    labTests: [
      { id: "LT-6", name: "Blood Sugar", status: "Pending", pdfFilename: null, pdfData: null },
    ],
    hospitalCode: "CITYHOSP01",
  },
];
