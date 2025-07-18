export interface AuditLogEntry {
  action: 'created' | 'status_changed' | 'updated';
  user: string;
  timestamp: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export type AuditLog = AuditLogEntry[];
