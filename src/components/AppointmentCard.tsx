import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

interface AppointmentCardProps {
  appointment: {
    id: string;
    title: string;
    type: string;
    startTime: Date | string;
    endTime: Date | string;
    patient?: { name: string; phone: string; email: string };
    reminders?: { channel: string; status: string }[];
    notes?: string | null;
  };
  onView?: (id: string) => void;
  onSendReminder?: (id: string) => void;
  showPatient?: boolean;
}

const typeColors: Record<string, string> = {
  chemotherapy: 'bg-purple-100 text-purple-700',
  radiation: 'bg-blue-100 text-blue-700',
  immunotherapy: 'bg-green-100 text-green-700',
  consultation: 'bg-amber-100 text-amber-700',
  followup: 'bg-teal-100 text-teal-700',
};

const typeLabels: Record<string, string> = {
  chemotherapy: 'Chemotherapy',
  radiation: 'Radiation Therapy',
  immunotherapy: 'Immunotherapy',
  consultation: 'Consultation',
  followup: 'Follow-up',
};

export default function AppointmentCard({
  appointment,
  onView,
  onSendReminder,
  showPatient = false,
}: AppointmentCardProps) {
  const startDate = new Date(appointment.startTime);
  const isUpcoming = !isPast(startDate);
  const reminderStatuses = appointment.reminders?.map((r) => r.status) || [];

  const getDateLabel = () => {
    if (isToday(startDate)) return 'Today';
    if (isTomorrow(startDate)) return 'Tomorrow';
    return format(startDate, 'EEEE, MMM d');
  };

  const getReminderStatus = () => {
    if (reminderStatuses.length === 0) return null;
    if (reminderStatuses.every((s) => s === 'sent')) return 'sent';
    if (reminderStatuses.some((s) => s === 'failed')) return 'failed';
    if (reminderStatuses.some((s) => s === 'pending')) return 'pending';
    return null;
  };

  const reminderStatus = getReminderStatus();

  return (
    <div className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 p-6 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-mono text-primary font-bold">
              {format(startDate, 'h:mm')}
            </span>
            <span className="text-text-secondary">{format(startDate, 'a')}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[appointment.type] || 'bg-gray-100 text-gray-700'}`}>
              {typeLabels[appointment.type] || appointment.type}
            </span>
          </div>
          
          <p className="text-text-secondary text-sm mb-1">{getDateLabel()}</p>
          
          {showPatient && appointment.patient && (
            <p className="text-text-primary font-medium">{appointment.patient.name}</p>
          )}
          
          <p className="text-text-secondary text-sm mt-1">{appointment.title}</p>
          
          {appointment.notes && (
            <p className="text-text-secondary text-sm mt-2 line-clamp-2">{appointment.notes}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {reminderStatus && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              reminderStatus === 'sent' ? 'bg-green-100 text-green-700' :
              reminderStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                reminderStatus === 'sent' ? 'bg-green-500' :
                reminderStatus === 'pending' ? 'bg-amber-500 animate-pulse-dot' :
                'bg-red-500'
              }`} />
              {reminderStatus === 'sent' ? 'Reminded' : reminderStatus === 'pending' ? 'Pending' : 'Failed'}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        {onView && (
          <button
            onClick={() => onView(appointment.id)}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-button text-sm font-medium transition-colors"
          >
            View Details
          </button>
        )}
        {onSendReminder && isUpcoming && (
          <button
            onClick={() => onSendReminder(appointment.id)}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-600 text-white rounded-button text-sm font-medium transition-colors"
          >
            Send Reminder
          </button>
        )}
      </div>
    </div>
  );
}
