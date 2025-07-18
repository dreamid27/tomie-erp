import { Injectable } from '@nestjs/common';
import { AuditLogEntry, AuditLog } from '../interfaces/audit-log.interface';

@Injectable()
export class AuditService {
  createAuditEntry(
    action: AuditLogEntry['action'],
    user: string,
    details: string,
    previousValue?: string,
    newValue?: string,
  ): AuditLogEntry {
    return {
      action,
      user,
      timestamp: new Date().toISOString(),
      details,
      ...(previousValue && { previousValue }),
      ...(newValue && { newValue }),
    };
  }

  addAuditEntry(existingLog: AuditLog | null, newEntry: AuditLogEntry): AuditLog {
    const log = existingLog || [];
    return [...log, newEntry];
  }

  createCreationEntry(user: string): AuditLogEntry {
    return this.createAuditEntry('created', user, 'Quotation created');
  }

  createStatusChangeEntry(
    user: string,
    previousStatus: string,
    newStatus: string,
  ): AuditLogEntry {
    return this.createAuditEntry(
      'status_changed',
      user,
      `Status changed from ${previousStatus} to ${newStatus}`,
      previousStatus,
      newStatus,
    );
  }

  createUpdateEntry(user: string, details: string): AuditLogEntry {
    return this.createAuditEntry('updated', user, details);
  }
}
