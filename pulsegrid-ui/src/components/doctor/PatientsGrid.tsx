import PatientCard from "./PatientCard";

type PatientRecord = {
  name: string;
  ward: string;
  bed: string;
  age: number;
  status: "Stable" | "Warning" | "Critical";
  heartRate: number;
  spo2: number;
  temperature: number;
  respiration: number;
  recovery: number;
};

const patients: PatientRecord[] = [
  {
    name: "Arjun Sharma",
    ward: "ICU-A",
    bed: "A12",
    age: 64,
    status: "Stable",
    heartRate: 74,
    spo2: 98,
    temperature: 36.8,
    respiration: 18,
    recovery: 92,
  },

  {
    name: "Meera Iyer",
    ward: "ICU-A",
    bed: "A14",
    age: 71,
    status: "Warning",
    heartRate: 102,
    spo2: 94,
    temperature: 38.1,
    respiration: 25,
    recovery: 45,
  },

  {
    name: "Vikram Reddy",
    ward: "ICU-B",
    bed: "B03",
    age: 58,
    status: "Critical",
    heartRate: 118,
    spo2: 88,
    temperature: 39.2,
    respiration: 30,
    recovery: 21,
  },

  {
    name: "Lakshmi Menon",
    ward: "POST-OP",
    bed: "E01",
    age: 55,
    status: "Stable",
    heartRate: 83,
    spo2: 99,
    temperature: 36.8,
    respiration: 12,
    recovery: 87,
  },
];

export default function PatientsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
      {patients.map((patient, index) => (
        <PatientCard
          key={index}
          {...patient}
        />
      ))}
    </div>
  );
}