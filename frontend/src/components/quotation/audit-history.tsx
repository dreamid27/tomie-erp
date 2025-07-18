import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  History,
} from 'lucide-react';
import type { AuditLog, AuditLogEntry } from '@/services/quotation.service';

interface AuditHistoryProps {
  auditLog?: AuditLog;
  className?: string;
}

export function AuditHistory({ auditLog, className }: AuditHistoryProps) {
  if (!auditLog || auditLog.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" />
            Audit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No history available</p>
        </CardContent>
      </Card>
    );
  }

  const getActionIcon = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'created':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'status_changed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadgeVariant = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'created':
        return 'default';
      case 'status_changed':
        return 'default';
      case 'updated':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
    } catch {
      return timestamp;
    }
  };

  const formatActionText = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'created':
        return 'Created';
      case 'status_changed':
        return 'Status Changed';
      case 'updated':
        return 'Updated';
      default:
        return action;
    }
  };

  // Sort by timestamp descending (most recent first)
  const sortedLog = [...auditLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Audit History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLog.map((entry, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < sortedLog.length - 1 && (
                <div className="absolute left-6 top-8 bottom-0 w-px bg-border" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {getActionIcon(entry.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionBadgeVariant(entry.action)}>
                        {formatActionText(entry.action)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{entry.user}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-2">
                    {entry.details}
                  </p>

                  {/* Additional details for status changes */}
                  {entry.action === 'status_changed' &&
                    entry.previousValue &&
                    entry.newValue && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        <span className="font-medium">Changed from:</span>{' '}
                        {entry.previousValue} → {entry.newValue}
                      </div>
                    )}
                </div>
              </div>

              {/* Separator between entries */}
              {index < sortedLog.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
