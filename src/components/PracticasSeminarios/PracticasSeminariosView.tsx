import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './Header';
import { MonthCalendarView } from './MonthCalendarView';
import { MatrixTableView } from './MatrixTableView';
import { SessionDetailModal } from './SessionDetailModal';
import { CoordinatorModal } from './CoordinatorModal';
import { PrintModal } from './PrintModal';
import { FilterState, ComputedSession, TemplateWeek, ShiftType } from '../../types/practicasSeminarios';
import {
  getDefaultStartMonday,
  formatDateToISO,
  parseISODate,
  computeAllSessions,
  generateICS,
} from '../../utils/practicasSeminarios/perpetualDateUtils';
import {
  COURSE_INFO,
  PROFESSORS_LIST,
  PROFESSOR_EMAILS,
  TEMPLATE_WEEKS,
} from '../../data/practicasSeminarios/curriculumData';
import {
  Check,
  Calendar,
  Download,
  GraduationCap,
  Info,
  ShieldCheck,
  Clock,
  Sparkles,
  BookOpen,
  FlaskConical,
  Layers,
  MapPin,
  Users
} from 'lucide-react';

interface PracticasSeminariosViewProps {
  embedded?: boolean;
}

export const PracticasSeminariosView: React.FC<PracticasSeminariosViewProps> = ({ embedded = false }) => {
  // Current academic year default: 2026
  const [academicYear, setAcademicYear] = useState<number>(2026);

  // Coordinator Authentication & Modal State
  const [coordinatorEmail, setCoordinatorEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ugr_medicina_coordinator_email');
    } catch {
      return null;
    }
  });
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Dynamic Teaching Staff & Assignments per academic year
  const [professorsList, setProfessorsList] = useState<string[]>(() => {
    try {
      if (window.location.hash.startsWith('#docencia=')) {
        const encoded = decodeURIComponent(window.location.hash.replace('#docencia=', ''));
        const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        if (parsed.professorsList) return parsed.professorsList;
      }
      const saved = localStorage.getItem('ugr_medicina_professors_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored professors', e);
    }
    return PROFESSORS_LIST;
  });

  const [professorEmails, setProfessorEmails] = useState<Record<string, string>>(() => {
    try {
      if (window.location.hash.startsWith('#docencia=')) {
        const encoded = decodeURIComponent(window.location.hash.replace('#docencia=', ''));
        const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        if (parsed.professorEmails) return parsed.professorEmails;
      }
      const saved = localStorage.getItem('ugr_medicina_professor_emails');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored emails', e);
    }
    return PROFESSOR_EMAILS;
  });

  const [templateWeeks, setTemplateWeeks] = useState<TemplateWeek[]>(() => {
    try {
      if (window.location.hash.startsWith('#docencia=')) {
        const encoded = decodeURIComponent(window.location.hash.replace('#docencia=', ''));
        const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        if (parsed.templateWeeks) return parsed.templateWeeks;
      }
      const saved = localStorage.getItem(`ugr_medicina_template_weeks_${2026}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed[0]?.dateLabel === '15-19 febrero' &&
          Object.keys(parsed[0]?.assignments?.practice || {}).length > 0
        ) {
          localStorage.setItem(`ugr_medicina_template_weeks_${2026}`, JSON.stringify(TEMPLATE_WEEKS));
          return TEMPLATE_WEEKS;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored template weeks', e);
    }
    return TEMPLATE_WEEKS;
  });

  // Persist coordinator changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ugr_medicina_professors_list', JSON.stringify(professorsList));
      localStorage.setItem('ugr_medicina_professor_emails', JSON.stringify(professorEmails));
      localStorage.setItem(`ugr_medicina_template_weeks_${academicYear}`, JSON.stringify(templateWeeks));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  }, [professorsList, professorEmails, templateWeeks, academicYear]);

  // Handle coordinator login & logout
  const handleCoordinatorLogin = (email: string) => {
    setCoordinatorEmail(email);
    try {
      localStorage.setItem('ugr_medicina_coordinator_email', email);
    } catch {}
    showToast(`Identificado como docente: ${email}`);
  };

  const handleCoordinatorLogout = () => {
    setCoordinatorEmail(null);
    try {
      localStorage.removeItem('ugr_medicina_coordinator_email');
    } catch {}
    showToast('Sesión de coordinación cerrada.');
  };

  const handleResetToDefaults = () => {
    setProfessorsList(PROFESSORS_LIST);
    setProfessorEmails(PROFESSOR_EMAILS);
    setTemplateWeeks(TEMPLATE_WEEKS);
    try {
      localStorage.removeItem('ugr_medicina_professors_list');
      localStorage.removeItem('ugr_medicina_professor_emails');
      localStorage.removeItem(`ugr_medicina_template_weeks_${academicYear}`);
    } catch {}
    showToast('Asignaciones restablecidas a los valores oficiales de Bioquímica Médica.');
  };

  // Reassign professor or shift directly from session modal
  const handleReassignSessionProfessor = (
    weekIndex: number,
    activityType: 'practice' | 'seminar',
    groupNumber: number,
    newProfessor: string,
    newShift?: ShiftType
  ) => {
    const updatedWeeks = templateWeeks.map((week) => {
      if (week.weekIndex !== weekIndex) return week;
      const actKey = activityType === 'practice' ? 'practice' : 'seminar';
      const map = { ...(week.assignments[actKey] || {}) };
      Object.keys(map).forEach((d) => {
        const dayNum = Number(d);
        if (map[dayNum]?.groupNumber === groupNumber) {
          map[dayNum] = {
            ...map[dayNum],
            professor: newProfessor,
            shift: newShift !== undefined ? newShift : map[dayNum].shift || 'mañana',
          };
        }
      });
      return {
        ...week,
        assignments: {
          ...week.assignments,
          [actKey]: map,
        },
      };
    });
    setTemplateWeeks(updatedWeeks);
    showToast(`Subgrupo ${groupNumber} actualizado con éxito.`);
  };

  // Update professor or shift for a specific day in matrix table
  const handleUpdateDayAssignment = (
    weekIndex: number,
    activityType: 'practice' | 'seminar',
    day: number,
    newProfessor: string,
    newShift?: ShiftType
  ) => {
    const updatedWeeks = templateWeeks.map((week) => {
      if (week.weekIndex !== weekIndex) return week;
      const actKey = activityType === 'practice' ? 'practice' : 'seminar';
      const targetMap = { ...(week.assignments[actKey] || {}) };
      const current = targetMap[day];
      if (current) {
        targetMap[day] = {
          ...current,
          professor: newProfessor,
          shift: newShift !== undefined ? newShift : current.shift || 'mañana',
        };
      }
      return {
        ...week,
        assignments: {
          ...week.assignments,
          [actKey]: targetMap,
        },
      };
    });
    setTemplateWeeks(updatedWeeks);
    const dayNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    showToast(`Asignación de Semana ${weekIndex} (${dayNames[day] || ''}) actualizada.`);
  };

  // Generation date formatted for printable document
  const generationDateStr = useMemo(() => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }, []);

  // Start Monday date state (Second Semester: starts in February)
  const defaultMonday = useMemo(() => getDefaultStartMonday(academicYear), [academicYear]);
  const [startMondayStr, setStartMondayStr] = useState<string>(() => formatDateToISO(getDefaultStartMonday(2026)));

  // Active navigation view: 'month' (default) or 'matrix' (official full layout)
  const [activeView, setActiveView] = useState<'month' | 'matrix'>('matrix');

  // Selected month for Month Calendar view (Second Semester: 1=Feb, 2=Mar, 3=Abr, 4=May)
  const [calendarMonthIndex, setCalendarMonthIndex] = useState<number>(1);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedProfessor: '',
    selectedGroup: '',
    selectedShift: '',
    selectedActivityType: '',
    selectedRoom: '',
  });

  // Selected session for detail modal
  const [selectedSession, setSelectedSession] = useState<ComputedSession | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleYearChange = (newYear: number) => {
    setAcademicYear(newYear);
    const newDefaultMonday = getDefaultStartMonday(newYear);
    setStartMondayStr(formatDateToISO(newDefaultMonday));
    try {
      const savedForYear = localStorage.getItem(`ugr_medicina_template_weeks_${newYear}`);
      if (savedForYear) {
        setTemplateWeeks(JSON.parse(savedForYear));
      }
    } catch {}
    showToast(`Curso actualizado a ${newYear} - ${newYear + 1}`);
  };

  // Compute all sessions dynamically
  const allComputedSessions = useMemo(() => {
    const parsedStart = parseISODate(startMondayStr);
    return computeAllSessions(parsedStart, templateWeeks, professorEmails);
  }, [startMondayStr, templateWeeks, professorEmails]);

  // Keep selectedSession in sync if reallocated
  useEffect(() => {
    if (selectedSession) {
      const updated = allComputedSessions.find((s) => s.id === selectedSession.id);
      if (updated && (updated.professor !== selectedSession.professor || updated.shift !== selectedSession.shift)) {
        setSelectedSession(updated);
      }
    }
  }, [allComputedSessions, selectedSession]);

  // Apply filters
  const filteredSessions = useMemo(() => {
    return allComputedSessions.filter((s) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesQuery =
          s.title.toLowerCase().includes(q) ||
          s.activityCode.toLowerCase().includes(q) ||
          s.professor.toLowerCase().includes(q) ||
          s.room.toLowerCase().includes(q) ||
          `grupo ${s.groupNumber}`.toLowerCase().includes(q) ||
          `subgrupo ${s.groupNumber}`.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (filters.selectedProfessor && s.professor !== filters.selectedProfessor) {
        return false;
      }
      if (filters.selectedGroup) {
        if (filters.selectedGroup === 'A' || filters.selectedGroup === 'B') {
          if (s.groupLetter !== filters.selectedGroup) return false;
        } else {
          if (String(s.groupNumber) !== filters.selectedGroup) return false;
        }
      }
      if (filters.selectedShift && s.shift !== filters.selectedShift) {
        return false;
      }
      if (filters.selectedActivityType && s.activityType !== filters.selectedActivityType) {
        return false;
      }
      if (filters.selectedRoom && s.room !== filters.selectedRoom) {
        return false;
      }
      return true;
    });
  }, [allComputedSessions, filters]);

  // Export calendar ICS
  const handleExportICS = () => {
    const icsContent = generateICS(filteredSessions, `${academicYear}-${academicYear + 1}`);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bioquimica_Medica_${academicYear}-${academicYear + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendario iCal descargado para añadir a Google Calendar, Outlook o Apple Calendar.');
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct window.print() failed', e);
    }
    const isInsideIframe = window.self !== window.top;
    if (isInsideIframe) {
      setIsPrintModalOpen(true);
    }
  };

  const currentStartMondayDate = useMemo(() => parseISODate(startMondayStr), [startMondayStr]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header with Medicine Yellow Accents */}
      <Header
        academicYear={academicYear}
        onYearChange={handleYearChange}
        activeView={activeView}
        onViewChange={setActiveView}
        onExportICS={handleExportICS}
        onPrint={handlePrint}
        coordinatorEmail={coordinatorEmail}
        onOpenCoordinator={() => setIsCoordinatorModalOpen(true)}
      />

      {/* Coordinator Active Notice Bar */}
      {coordinatorEmail && (
        <div className="no-print bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-amber-950 px-4 py-2 text-xs shadow-xs border-b border-amber-400 font-medium rounded-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-950 shrink-0" />
              <span>
                <strong>Modo Organización Docente Activo:</strong> Conectado como{' '}
                <span className="font-mono font-bold underline">{coordinatorEmail}</span>. Puedes reasignar profesorado y turnos directamente en la tabla o desde el panel.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCoordinatorModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-black text-amber-300 font-bold transition-colors shadow-2xs cursor-pointer"
              >
                Panel de Coordinación
              </button>
              <button
                type="button"
                onClick={handleCoordinatorLogout}
                className="px-2 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-amber-950 font-bold transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Blocks Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COURSE_INFO.blocks.map((b) => (
          <div
            key={b.number}
            className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:border-amber-400 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                Bloque {b.number}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Subgrupos 1-15</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Práctica ({COURSE_INFO.rooms.practice})</span>
                  <span className="font-semibold text-slate-800 leading-tight">{b.practice}</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 pt-1 border-t border-slate-100">
                <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Seminario ({COURSE_INFO.rooms.seminar})</span>
                  <span className="font-semibold text-slate-800 leading-tight">{b.seminar}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Component Switcher */}
      {activeView === 'matrix' && (
        <MatrixTableView
          startMonday={currentStartMondayDate}
          academicYear={academicYear}
          filters={filters}
          onSelectSessionById={(id) => {
            const session = allComputedSessions.find((s) => s.id === id);
            if (session) setSelectedSession(session);
          }}
          computedSessions={filteredSessions}
          templateWeeks={templateWeeks}
          onUpdateDayAssignment={handleUpdateDayAssignment}
        />
      )}

      {activeView === 'month' && (
        <MonthCalendarView
          year={academicYear}
          monthIndex={calendarMonthIndex}
          onMonthChange={setCalendarMonthIndex}
          sessions={filteredSessions}
          filters={filters}
          onSelectSession={setSelectedSession}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          academicYear={academicYear}
          isCoordinator={!!coordinatorEmail}
          professorsList={professorsList}
          onReassignSessionProfessor={handleReassignSessionProfessor}
        />
      )}

      {/* Coordinator Management Modal */}
      <CoordinatorModal
        isOpen={isCoordinatorModalOpen}
        onClose={() => setIsCoordinatorModalOpen(false)}
        coordinatorEmail={coordinatorEmail}
        onLogin={handleCoordinatorLogin}
        onLogout={handleCoordinatorLogout}
        professorsList={professorsList}
        professorEmails={professorEmails}
        templateWeeks={templateWeeks}
        academicYear={academicYear}
        onUpdateProfessorList={(newList, newEmails) => {
          setProfessorsList(newList);
          setProfessorEmails(newEmails);
        }}
        onUpdateTemplateWeeks={setTemplateWeeks}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Print Assistant Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        academicYear={academicYear}
        selectedGroup={filters.selectedGroup}
        generationDateStr={generationDateStr}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-amber-400/40 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
