// src/components/widgets/DiaryArchive/DiaryArchive.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useDiaryStore from '../../../stores/useDiaryStore';
import MarkdownEditor from '../../common/MarkdownEditor';
import {
  ArchiveContainer,
  MonthsList,
  MonthItem,
  ArchiveContent,
  ArchiveHeader,
  ExportButton,
  NoArchivesMessage,
  DayEntry,
  DayHeader,
  DayContent
} from './DiaryArchive.styles';

/**
 * Diary Archive widget for viewing and exporting monthly journal archives
 * Affiche la navigation par mois et le contenu des entrées archivées
 * @renders ArchiveContainer
 * @renders MonthsList
 * @renders MonthItem
 * @renders ArchiveContent
 * @renders ArchiveHeader
 * @renders ExportButton
 * @renders NoArchivesMessage
 * @renders DayEntry
 * @renders DayHeader
 * @renders DayContent
 * @renders MarkdownEditor
 */
const DiaryArchive = () => {
  const {
    getArchivedMonths,
    getMonthlyArchive,
    exportMonthToMarkdown
  } = useDiaryStore();

  const [selectedMonth, setSelectedMonth] = useState(null);
  const archivedMonths = getArchivedMonths();

  // Sélectionner automatiquement le premier mois si aucun n'est sélectionné
  React.useEffect(() => {
    if (!selectedMonth && archivedMonths.length > 0) {
      setSelectedMonth(archivedMonths[0]);
    }
  }, [archivedMonths]);

  const handleExport = () => {
    if (!selectedMonth) return;

    const markdown = exportMonthToMarkdown(selectedMonth);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-${selectedMonth}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatMonthName = (yearMonth) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDayName = (dateString) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const monthArchive = selectedMonth ? getMonthlyArchive(selectedMonth) : {};
  const sortedDays = Object.entries(monthArchive).sort(([a], [b]) => a.localeCompare(b));

  if (archivedMonths.length === 0) {
    return (
      <ArchiveContainer>
        <NoArchivesMessage>
          Aucune archive disponible pour le moment.
          Les entrées du journal sont archivées automatiquement à la fin de chaque mois.
        </NoArchivesMessage>
      </ArchiveContainer>
    );
  }

  return (
    <ArchiveContainer>
      <MonthsList>
        <ArchiveHeader>Archives du journal</ArchiveHeader>
        {archivedMonths.map(month => (
          <MonthItem
            key={month}
            $isActive={month === selectedMonth}
            onClick={() => setSelectedMonth(month)}
          >
            {formatMonthName(month)}
          </MonthItem>
        ))}
      </MonthsList>

      <ArchiveContent>
        {selectedMonth && (
          <>
            <ArchiveHeader>
              {formatMonthName(selectedMonth)}
              <ExportButton onClick={handleExport}>
                Exporter en Markdown
              </ExportButton>
            </ArchiveHeader>

            {sortedDays.map(([date, content]) => (
              <DayEntry key={date}>
                <DayHeader>{formatDayName(date)}</DayHeader>
                <DayContent>
                  <MarkdownEditor
                    value={content}
                    onChange={() => {}} // Lecture seule
                    placeholder=""
                    variant="embedded"
                    showPreview={true}
                    height="auto"
                    readOnly={true}
                  />
                </DayContent>
              </DayEntry>
            ))}
          </>
        )}
      </ArchiveContent>
    </ArchiveContainer>
  );
};

DiaryArchive.propTypes = {};

DiaryArchive.defaultProps = {};

export default DiaryArchive;