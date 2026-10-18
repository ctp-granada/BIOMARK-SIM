import { jsPDF } from 'jspdf';
import { OrganMetabolicProfile, MetabolicState, EnzymeActivity } from '../types/metabolism';

interface OrganSpecializedSynthesis {
  title: string;
  keyFeatures: string[];
}

export interface GenerateOrganPdfOptions {
  organSpecialized: OrganSpecializedSynthesis;
  activeOrganProfile?: OrganMetabolicProfile;
  currentState: MetabolicState;
  organStateBadgeText: string;
}

// Clean text to avoid problematic characters in basic font
const sanitizePdfText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[^\x00-\xFF]/g, (char) => {
      // Common biochemistry symbols to readable equivalents
      switch (char) {
        case '↑': return '(+)';
        case '↓': return '(-)';
        case '→': return '->';
        case '·': return '·';
        case '✦': return '*';
        case '🔬': return '';
        case '🧬': return '';
        case '⚡': return '';
        case '—': return '-';
        case '–': return '-';
        case '«': return '"';
        case '»': return '"';
        case '“': return '"';
        case '”': return '"';
        case '’': return "'";
        case '‘': return "'";
        case 'β': return 'beta';
        case 'α': return 'alfa';
        case 'γ': return 'gamma';
        case 'Δ': return 'delta';
        default: return '';
      }
    })
    .trim();
};

export const generateOrganPdf = ({
  organSpecialized,
  activeOrganProfile,
  currentState,
  organStateBadgeText,
}: GenerateOrganPdfOptions): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - 18;

  let y = 16;

  const drawPageHeader = () => {
    // Top colored banner bar
    doc.setFillColor(15, 118, 110); // Teal 700
    doc.rect(margin, 8, contentWidth, 2, 'F');
  };

  const drawPageFooter = (pageNum: number, totalPagesPlaceholder: boolean = false) => {
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      'Atlas de Bioquimica & Fisiologia Humana - Apuntes de Estudio',
      margin,
      pageHeight - 8
    );

    const pageStr = totalPagesPlaceholder ? `Pagina ${pageNum}` : `Pagina ${pageNum}`;
    doc.text(pageStr, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > bottomThreshold) {
      doc.addPage();
      y = 16;
      drawPageHeader();
    }
  };

  drawPageHeader();

  // 1. Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('ATLAS DE BIOQUIMICA MEDICA & FISIOLOGIA INTEGRADA', margin, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate 900
  const titleLines = doc.splitTextToSize(sanitizePdfText(organSpecialized.title), contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6.5 + 2;

  // Metadata ribbon box
  doc.setFillColor(240, 253, 250); // Teal 50
  doc.setDrawColor(204, 251, 241); // Teal 100
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 94, 89); // Teal 800
  doc.text(
    `Situacion actual: ${sanitizePdfText(currentState.title)} (${sanitizePdfText(currentState.timeframe)})`,
    margin + 3,
    y + 5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // Slate 600
  const dateStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Fecha de generacion: ${dateStr}`, margin + 3, y + 10);
  doc.text(
    `Comportamiento: ${sanitizePdfText(organStateBadgeText)}`,
    pageWidth - margin - 3,
    y + 10,
    { align: 'right' }
  );
  y += 18;

  // 2. Section: IDEAS CLAVE DEL ORGANO (Puntos Criticos & Rigor Academico)
  ensureSpace(16);
  doc.setFillColor(15, 118, 110);
  doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('IDEAS CLAVE DE ESTE ORGANO (PUNTOS CRITICOS DE EXAMEN)', margin + 3, y + 4.8);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Conceptos de integracion tisular y especializacion fisiologica fundamentales:',
    margin,
    y
  );
  y += 4;

  organSpecialized.keyFeatures.forEach((feat, index) => {
    const sanitizedFeat = sanitizePdfText(feat);
    const textLines = doc.splitTextToSize(sanitizedFeat, contentWidth - 12);
    const boxHeight = Math.max(10, textLines.length * 4.5 + 4);

    ensureSpace(boxHeight + 3);

    // Feature card
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    // Bullet dot
    doc.setFillColor(13, 148, 136); // Teal 600
    doc.circle(margin + 4, y + 4.5, 1.2, 'F');

    // Bullet text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text(textLines, margin + 8, y + 4.8);

    y += boxHeight + 2.5;
  });

  y += 4;

  // 3. Section: PERFIL METABOLICO EN LA SITUACION ACTUAL
  if (activeOrganProfile) {
    ensureSpace(24);
    doc.setFillColor(51, 65, 85); // Slate 700
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `METABOLISMO EN: ${sanitizePdfText(currentState.title).toUpperCase()}`,
      margin + 3,
      y + 4.8
    );
    y += 10;

    // Summary description box
    const roleLines = doc.splitTextToSize(
      sanitizePdfText(activeOrganProfile.roleSummary),
      contentWidth - 6
    );
    const roleBoxH = roleLines.length * 4.5 + 4;
    ensureSpace(roleBoxH + 4);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, roleBoxH, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(roleLines, margin + 3, y + 4.5);
    y += roleBoxH + 4;

    // Fuel comparison grid (2 columns)
    const colWidth = (contentWidth - 4) / 2;
    ensureSpace(18);

    // Left Col: Combustible Primario
    doc.setFillColor(254, 242, 242); // Red/Orange tint
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, colWidth, 16, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(185, 28, 28);
    doc.text('COMBUSTIBLE CONSUMIDO / PRIORITARIO:', margin + 3, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const fuelUsedLines = doc.splitTextToSize(
      sanitizePdfText(activeOrganProfile.primaryFuelUsed),
      colWidth - 6
    );
    doc.text(fuelUsedLines, margin + 3, y + 9);

    // Right Col: Combustible Producido / Exportado
    doc.setFillColor(236, 253, 245); // Emerald tint
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin + colWidth + 4, y, colWidth, 16, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(4, 120, 87);
    doc.text('COMBUSTIBLE EXPORTADO / PRODUCIDO:', margin + colWidth + 7, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const fuelProducedLines = doc.splitTextToSize(
      sanitizePdfText(activeOrganProfile.fuelProducedOrExported),
      colWidth - 6
    );
    doc.text(fuelProducedLines, margin + colWidth + 7, y + 9);

    y += 20;

    // ATP Strategy Note
    if (activeOrganProfile.atpGenerationStrategy) {
      ensureSpace(12);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 118, 110);
      doc.text('Estrategia de Generacion de ATP:', margin + 3, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(
        sanitizePdfText(activeOrganProfile.atpGenerationStrategy),
        margin + 48,
        y + 4.5
      );
      y += 14;
    }

    // 4. Section: ENZIMAS REGULADORAS CLAVE
    if (activeOrganProfile.keyEnzymes && activeOrganProfile.keyEnzymes.length > 0) {
      ensureSpace(18);
      doc.setFillColor(15, 118, 110);
      doc.roundedRect(margin, y, contentWidth, 6.5, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('ENZIMAS REGULADORAS CLAVE & MECANISMOS', margin + 3, y + 4.5);
      y += 9.5;

      activeOrganProfile.keyEnzymes.forEach((enz: EnzymeActivity) => {
        const enzymeName = `${sanitizePdfText(enz.name)} (${sanitizePdfText(enz.abbreviation)})`;
        const pathwayLoc = `Via: ${sanitizePdfText(enz.pathway)} | Ubicacion: ${sanitizePdfText(enz.cellularLocation)} | Estado: ${sanitizePdfText(enz.status).toUpperCase()}`;
        const mechanismLines = doc.splitTextToSize(
          `Mecanismo: ${sanitizePdfText(enz.mechanism)}`,
          contentWidth - 6
        );
        const cardH = 10 + mechanismLines.length * 4;

        ensureSpace(cardH + 2);

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, cardH, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(enzymeName, margin + 3, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(pathwayLoc, margin + 3, y + 8.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(mechanismLines, margin + 3, y + 13);

        y += cardH + 2.5;
      });
    }

    // 5. Section: VIAS METABOLICAS
    if (activeOrganProfile.activePathways?.length || activeOrganProfile.inhibitedPathways?.length) {
      ensureSpace(20);
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('RESUMEN DE RUTAS METABOLICAS:', margin, y);
      y += 4;

      if (activeOrganProfile.activePathways?.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(4, 120, 87);
        doc.text('[+] Vias Activas / Inducidas:', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const activeLines = doc.splitTextToSize(
          sanitizePdfText(activeOrganProfile.activePathways.join('  ·  ')),
          contentWidth - 38
        );
        doc.text(activeLines, margin + 38, y);
        y += Math.max(5, activeLines.length * 4 + 2);
      }

      if (activeOrganProfile.inhibitedPathways?.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(185, 28, 28);
        doc.text('[-] Vias Inhibidas / Reprimidas:', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const inhibLines = doc.splitTextToSize(
          sanitizePdfText(activeOrganProfile.inhibitedPathways.join('  ·  ')),
          contentWidth - 42
        );
        doc.text(inhibLines, margin + 42, y);
        y += Math.max(5, inhibLines.length * 4 + 2);
      }
    }
  }

  // Draw footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(i);
  }

  // Generate safe filename
  const cleanOrgan = (activeOrganProfile?.organName || 'Organo')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
  const cleanState = currentState.id;
  const fileName = `Ideas_Clave_${cleanOrgan}_${cleanState}.pdf`;

  // Trigger download
  doc.save(fileName);
};
