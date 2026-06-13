import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { patients as defaultPatients, alerts as defaultAlerts, hospitals as defaultHospitals } from '../common/mock-data';

@Injectable()
export class FallbackDbService implements OnModuleInit {
  private readonly logger = new Logger(FallbackDbService.name);
  private readonly filePath = path.join(process.cwd(), 'database-fallback.json');
  private data: {
    hospitals: any[];
    patients: any[];
    alerts: any[];
    doctorProfile: any;
    doctorSettings: any;
    users: any[];
  } = {
    hospitals: [],
    patients: [],
    alerts: [],
    doctorProfile: null,
    doctorSettings: null,
    users: [],
  };

  onModuleInit() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.users) {
          this.data.users = [];
        }
        // Upgrade existing patients with hospitalCode and labTests if missing
        this.data.patients = this.data.patients.map((p) => {
          let tests = p.labTests || [];
          if (tests.length === 0 && p.labTest && p.labTest !== 'None') {
            tests = p.labTest.split(',').map((name: string, index: number) => ({
              id: `LT-${p.id}-${index + 1}`,
              name: name.trim(),
              status: 'Pending',
              pdfFilename: null,
              pdfData: null,
            }));
          }
          return {
            hospitalCode: 'CITYHOSP01',
            labTests: tests,
            ...p,
          };
        });
        
        // Seed default users if empty
        if (this.data.users.length === 0) {
          this.data.users = [
            { id: 'U-1001', hospitalCode: 'CITYHOSP01', role: 'Doctor', name: 'Dr. Sarah Johnson', email: 'doctor@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Cardiologist' },
            { id: 'U-1002', hospitalCode: 'CITYHOSP01', role: 'Nurse', name: 'Nancy Wheeler', email: 'nurse@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Emergency Department' },
            { id: 'U-1003', hospitalCode: 'CITYHOSP01', role: 'Patient', name: 'Arjun Sharma', email: 'patient@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: null },
            { id: 'U-1004', hospitalCode: 'CITYHOSP01', role: 'Lab Tech', name: 'Ravi Thomas', email: 'lab@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Pathology Lab' },
            { id: 'U-1005', hospitalCode: 'CITYHOSP01', role: 'Hospital Admin', name: 'Jordan Lee', email: 'hospital.admin@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Platform Operations' }
          ];
        }
        this.save();
        this.logger.log(`Loaded fallback database from ${this.filePath}`);
      } else {
        this.logger.log('Fallback database file not found. Initializing with mock data...');
        this.data = {
          hospitals: [...defaultHospitals],
          patients: defaultPatients.map((p) => {
            let labTest = 'None';
            let tests: any[] = [];
            if (p.id === 'P-1043') {
              labTest = 'CBC, Lipid Panel';
              tests = [
                { id: 'LT-1043-1', name: 'CBC', status: 'Pending', pdfFilename: null, pdfData: null },
                { id: 'LT-1043-2', name: 'Lipid Panel', status: 'Pending', pdfFilename: null, pdfData: null },
              ];
            }
            if (p.id === 'P-1044') {
              labTest = 'CRP, ECG Study';
              tests = [
                { id: 'LT-1044-1', name: 'CRP', status: 'Pending', pdfFilename: null, pdfData: null },
                { id: 'LT-1044-2', name: 'ECG Study', status: 'Pending', pdfFilename: null, pdfData: null },
              ];
            }
            if (p.id === 'P-1045') {
              labTest = 'Urinalysis';
              tests = [
                { id: 'LT-1045-1', name: 'Urinalysis', status: 'Pending', pdfFilename: null, pdfData: null },
              ];
            }
            return {
              ...p,
              hospitalCode: 'CITYHOSP01',
              labTest,
              labTests: tests,
            };
          }),
          alerts: [...defaultAlerts],
          doctorProfile: {
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            hospital: "City General Hospital",
            email: "sarah.johnson@pulsegrid.health",
            phone: "+1 415 555 0188",
            ward: "Cardiac ICU",
            notificationEmail: true,
            smsAlerts: true,
            monitoringMode: "Live telemetry",
          },
          doctorSettings: {
            liveTelemetry: true,
            aiAlerts: true,
            autoRefresh: true,
            notifications: true,
            darkMode: false,
          },
          users: [
            { id: 'U-1001', hospitalCode: 'CITYHOSP01', role: 'Doctor', name: 'Dr. Sarah Johnson', email: 'doctor@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Cardiologist' },
            { id: 'U-1002', hospitalCode: 'CITYHOSP01', role: 'Nurse', name: 'Nancy Wheeler', email: 'nurse@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Emergency Department' },
            { id: 'U-1003', hospitalCode: 'CITYHOSP01', role: 'Patient', name: 'Arjun Sharma', email: 'patient@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: null },
            { id: 'U-1004', hospitalCode: 'CITYHOSP01', role: 'Lab Tech', name: 'Ravi Thomas', email: 'lab@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Pathology Lab' },
            { id: 'U-1005', hospitalCode: 'CITYHOSP01', role: 'Hospital Admin', name: 'Jordan Lee', email: 'hospital.admin@pulsegrid.health', password: 'PulseGrid@2026', specialtyOrDepartment: 'Platform Operations' }
          ]
        };
        this.save();
      }
    } catch (error) {
      this.logger.error('Failed to load/initialize fallback database', error);
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      this.logger.error('Failed to save fallback database', error);
    }
  }

  // Patients
  getPatients() {
    return this.data.patients;
  }

  getPatientById(id: string) {
    return this.data.patients.find((p) => p.id === id);
  }

  updatePatientLabTest(id: string, labTest: string) {
    const patient = this.data.patients.find((p) => p.id === id);
    if (patient) {
      patient.labTest = labTest;
      this.save();
      return true;
    }
    return false;
  }

  updatePatientLabTests(id: string, labTests: any[]) {
    const patient = this.data.patients.find((p) => p.id === id);
    if (patient) {
      patient.labTests = labTests;
      // Also update standard labTest string description
      patient.labTest = labTests.map((t) => t.name).join(', ') || 'None';
      this.save();
      return true;
    }
    return false;
  }

  addPatient(patient: any) {
    const newId = patient.id || `P-${1000 + this.data.patients.length + 1}`;
    const newPatient = {
      id: newId,
      ward: 'General',
      hr: 80,
      spo2: 98,
      status: 'Stable',
      recovery: 85,
      condition: 'Observation',
      doctor: 'Dr. Sarah Johnson',
      room: 'TBD',
      risk: 'Low',
      labTest: 'None',
      labTests: [],
      ...patient,
    };
    this.data.patients.push(newPatient);
    this.save();
    return newPatient;
  }

  // Alerts
  getAlerts() {
    return this.data.alerts;
  }

  resolveAlert(id: string | number) {
    const numericId = Number(id);
    const alert = this.data.alerts.find((a) => a.id === id || a.id === numericId);
    if (alert) {
      alert.status = 'RESOLVED';
      this.save();
      return true;
    }
    return false;
  }

  // Profile
  getDoctorProfile() {
    return this.data.doctorProfile;
  }

  saveDoctorProfile(profile: any) {
    this.data.doctorProfile = { ...this.data.doctorProfile, ...profile };
    this.save();
    return this.data.doctorProfile;
  }

  // Settings
  getDoctorSettings() {
    return this.data.doctorSettings;
  }

  saveDoctorSettings(settings: any) {
    this.data.doctorSettings = { ...this.data.doctorSettings, ...settings };
    this.save();
    return this.data.doctorSettings;
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  addUser(user: any) {
    const newId = user.id || `U-${1000 + this.data.users.length + 1}`;
    const newUser = {
      id: newId,
      ...user,
    };
    this.data.users.push(newUser);
    
    // If the registered user is a patient, also register them in the patients table
    if (user.role === 'Patient') {
      this.addPatient({
        id: `P-${1000 + this.data.patients.length + 1}`,
        name: user.name,
        age: user.age || 45,
        ward: user.ward || 'General',
        doctor: user.doctor || 'Dr. Sarah Johnson',
        hospitalCode: user.hospitalCode,
      });
    }

    this.save();
    return newUser;
  }
}
