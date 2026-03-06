// ===========================================
// Report Entity (Model)
// ===========================================
// TypeORM entity mapped to the 'reports' table in MySQL.

export class ReportEntity {
  id: number;
  // Define columns based on database schema
  createdAt: Date;
  updatedAt: Date;
}
