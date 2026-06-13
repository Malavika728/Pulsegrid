import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { DatabaseService } from '../../config/database.service';
import { FallbackDbService } from '../../config/fallback-db.service';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fallbackDbService: FallbackDbService,
  ) {}

  private mapPatient(row: any) {
    let labTests = [];
    try {
      if (row.lab_tests) {
        labTests = typeof row.lab_tests === 'string' ? JSON.parse(row.lab_tests) : row.lab_tests;
      } else if (row.labTests) {
        labTests = typeof row.labTests === 'string' ? JSON.parse(row.labTests) : row.labTests;
      }
    } catch {}

    // Fallback if empty but has old lab_test
    if ((!labTests || labTests.length === 0) && row.lab_test && row.lab_test !== 'None') {
      labTests = [{
        id: 'LT-1001',
        name: row.lab_test,
        status: row.lab_report_pdf ? 'Uploaded' : 'Pending',
        pdfFilename: row.lab_report_pdf || null,
      }];
    }

    return {
      id: row.id,
      name: row.name,
      ward: row.ward || 'General',
      age: row.age ?? 58,
      hr: row.hr ?? 82,
      spo2: row.spo2 ?? 97,
      status: row.status === 'ACTIVE' ? 'Stable' : row.status,
      recovery: row.recovery ?? 78,
      condition: row.diagnosis || row.condition || 'Monitoring in progress',
      doctor: row.doctor || 'On-call physician',
      room: row.room || 'TBD',
      risk: row.risk || 'Medium',
      labTest: row.lab_test || row.labTest || 'None',
      labTests,
      hospitalCode: row.hospital_code || row.hospitalCode || 'CITYHOSP01',
      labReportPdf: row.lab_report_pdf || row.labReportPdf || null,
    };
  }

  private mapAlert(row: any) {
    return {
      id: row.id,
      title: row.type || 'Alert',
      patient: row.patient || 'Unassigned',
      severity: row.severity || 'Info',
      time: row.created_at ? new Date(row.created_at).toLocaleTimeString() : 'Now',
    };
  }

  @Get()
  async findAll(@Query('hospitalCode') hospitalCode?: string) {
    try {
      let query = 'SELECT * FROM patients';
      const params = [];
      if (hospitalCode) {
        query += ' WHERE UPPER(hospital_code) = $1';
        params.push(hospitalCode.toUpperCase());
      }
      query += ' ORDER BY created_at DESC LIMIT 100';
      const rows = await this.databaseService.query(query, params);
      return rows.map((row) => this.mapPatient(row));
    } catch {
      const allPatients = this.fallbackDbService.getPatients();
      if (hospitalCode) {
        return allPatients
          .filter((p) => (p.hospital_code || p.hospitalCode || 'CITYHOSP01').toUpperCase() === hospitalCode.toUpperCase())
          .map((row) => this.mapPatient(row));
      }
      return allPatients.map((row) => this.mapPatient(row));
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const rows = await this.databaseService.query('SELECT * FROM patients WHERE id = $1', [id]);
      return rows[0] ? this.mapPatient(rows[0]) : this.fallbackDbService.getPatientById(id) || this.fallbackDbService.getPatients()[0];
    } catch {
      return this.fallbackDbService.getPatientById(id) || this.fallbackDbService.getPatients()[0];
    }
  }

  @Get(':id/overview')
  async getOverview(@Param('id') id: string) {
    try {
      const patientRows = await this.databaseService.query('SELECT * FROM patients WHERE id = $1', [id]);
      const alertRows = await this.databaseService.query('SELECT a.*, p.name AS patient FROM alerts a LEFT JOIN patients p ON p.id = a.patient_id WHERE a.patient_id = $1 ORDER BY a.created_at DESC', [id]);

      const patient = patientRows[0] ? this.mapPatient(patientRows[0]) : this.fallbackDbService.getPatientById(id) || this.fallbackDbService.getPatients()[0];

      return {
        patient,
        vitals: {
          heartRate: patient.hr,
          oxygenLevel: patient.spo2,
          temperature: 36.8,
        },
        ecg: {
          rhythm: patient.status === 'Critical' ? 'Irregular' : 'Normal',
          summary: 'ECG stream active',
        },
        medications: ['Aspirin', 'Beta-blocker'],
        reports: ['Discharge summary', 'Lab panel'],
        alerts: alertRows.length ? alertRows.map((row) => this.mapAlert(row)) : this.fallbackDbService.getAlerts().filter((item) => item.patient === patient.name),
        aiInsights: {
          riskScore: patient.risk,
          recoveryTrend: `${patient.recovery}%`,
        },
      };
    } catch {
      const patient = this.fallbackDbService.getPatientById(id) || this.fallbackDbService.getPatients()[0];
      return {
        patient,
        vitals: {
          heartRate: patient.hr,
          oxygenLevel: patient.spo2,
          temperature: 36.8,
        },
        ecg: {
          rhythm: patient.status === 'Critical' ? 'Irregular' : 'Normal',
          summary: 'ECG stream active',
        },
        medications: ['Aspirin', 'Beta-blocker'],
        reports: ['Discharge summary', 'Lab panel'],
        alerts: this.fallbackDbService.getAlerts().filter((item) => item.patient === patient.name),
        aiInsights: {
          riskScore: patient.risk,
          recoveryTrend: `${patient.recovery}%`,
        },
      };
    }
  }

  @Patch(':id/lab-test')
  async updateLabTest(@Param('id') id: string, @Body() body: { labTest: string }) {
    try {
      await this.databaseService.query(
        'UPDATE patients SET lab_test = $1 WHERE id = $2',
        [body.labTest, id]
      );
      return { id, labTest: body.labTest };
    } catch {
      this.fallbackDbService.updatePatientLabTest(id, body.labTest);
      return { id, labTest: body.labTest };
    }
  }

  @Patch(':id/upload-report')
  async uploadReport(@Param('id') id: string, @Body() body: { filename: string }) {
    try {
      await this.databaseService.query(
        'UPDATE patients SET lab_report_pdf = $1 WHERE id = $2',
        [body.filename, id]
      );
      return { id, labReportPdf: body.filename };
    } catch {
      this.fallbackDbService.updatePatientLabReport(id, body.filename);
      return { id, labReportPdf: body.filename };
    }
  }

  @Patch(':id/lab-tests')
  async updateLabTests(@Param('id') id: string, @Body() body: { labTests: any[] }) {
    const jsonStr = JSON.stringify(body.labTests);
    try {
      await this.databaseService.query(
        'UPDATE patients SET lab_tests = $1 WHERE id = $2',
        [jsonStr, id]
      );
      return { id, labTests: body.labTests };
    } catch {
      this.fallbackDbService.updatePatientLabTests(id, body.labTests);
      return { id, labTests: body.labTests };
    }
  }
}
