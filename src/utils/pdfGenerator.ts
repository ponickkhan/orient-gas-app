import jsPDF from 'jspdf';

interface Appliance {
  type: string;
  location: string;
  make: string;
  model: string;
  flueType: string;
  safetyCheck: 'Pass' | 'Fail' | 'Not Applicable';
  remedialAction?: string;
}

interface GasSafetyData {
  // Property Details
  propertyAddress: string;
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  
  // Engineer Details
  engineerName: string;
  engineerRegistration: string;
  companyName: string;
  companyAddress: string;
  
  // Inspection Details
  inspectionDate: string;
  nextInspectionDate: string;
  
  // Appliances
  appliances: Appliance[];
  
  // Additional checks
  gasSupplyPipework: 'Pass' | 'Fail' | 'Not Applicable';
  gasMetering: 'Pass' | 'Fail' | 'Not Applicable';
  emergencyControls: 'Pass' | 'Fail' | 'Not Applicable';
  ventilation: 'Pass' | 'Fail' | 'Not Applicable';
  
  // Overall assessment
  overallAssessment: 'Satisfactory' | 'Unsatisfactory';
  additionalComments?: string;
}

export async function generatePDF(data: GasSafetyData): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth?: number, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    if (maxWidth) {
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    } else {
      pdf.text(text, x, y);
      return y + (fontSize * 0.4);
    }
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to draw a box
  const drawBox = (x: number, y: number, width: number, height: number) => {
    pdf.rect(x, y, width, height);
  };

  // Header with border
  pdf.setLineWidth(1);
  drawBox(10, 10, pageWidth - 20, 35);

  // Title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LANDLORD GAS SAFETY RECORD', pageWidth / 2, yPosition + 8, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Gas Safety (Installation and Use) Regulations 1998', pageWidth / 2, yPosition + 18, { align: 'center' });
  pdf.text('Regulation 36(3)(a) and (b)', pageWidth / 2, yPosition + 28, { align: 'center' });

  yPosition += 50;

  // Property Details Section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. PREMISES TO WHICH THIS RECORD RELATES', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  // Property address box
  drawBox(15, yPosition, pageWidth - 30, 25);
  pdf.text('Address:', 18, yPosition + 6);
  yPosition = addText(data.propertyAddress, 18, yPosition + 12, pageWidth - 36, 9);
  yPosition += 20;

  // Landlord details
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. LANDLORD OR AGENT DETAILS', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  drawBox(15, yPosition, pageWidth - 30, 30);
  pdf.text('Name:', 18, yPosition + 6);
  pdf.text(data.landlordName, 35, yPosition + 6);
  pdf.text('Address:', 18, yPosition + 14);
  yPosition = addText(data.landlordAddress, 18, yPosition + 20, pageWidth - 36, 9);
  yPosition += 25;

  // Tenant details
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. TENANT DETAILS', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  drawBox(15, yPosition, pageWidth - 30, 15);
  pdf.text('Name:', 18, yPosition + 6);
  pdf.text(data.tenantName, 35, yPosition + 6);
  yPosition += 20;

  // Engineer Details Section
  checkNewPage(60);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. ENGINEER DETAILS', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  drawBox(15, yPosition, pageWidth - 30, 40);
  pdf.text('Name:', 18, yPosition + 6);
  pdf.text(data.engineerName, 35, yPosition + 6);

  pdf.text('Gas Safe Registration No:', 18, yPosition + 14);
  pdf.text(data.engineerRegistration, 70, yPosition + 14);

  pdf.text('Company:', 18, yPosition + 22);
  pdf.text(data.companyName, 40, yPosition + 22);

  pdf.text('Address:', 18, yPosition + 30);
  yPosition = addText(data.companyAddress, 40, yPosition + 30, pageWidth - 55, 9);
  yPosition += 25;

  // Inspection Details Section
  checkNewPage(40);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('5. INSPECTION DETAILS', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  const inspectionDateFormatted = new Date(data.inspectionDate).toLocaleDateString('en-GB');
  const nextInspectionDateFormatted = new Date(data.nextInspectionDate).toLocaleDateString('en-GB');

  drawBox(15, yPosition, pageWidth - 30, 25);
  pdf.text('Date of Check:', 18, yPosition + 6);
  pdf.text(inspectionDateFormatted, 50, yPosition + 6);

  pdf.text('Date of Next Check:', 18, yPosition + 14);
  pdf.text(nextInspectionDateFormatted, 60, yPosition + 14);
  yPosition += 30;

  // Appliances Section
  checkNewPage(100);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('6. GAS APPLIANCES, FLUES AND PIPEWORK CHECKED', 15, yPosition);
  yPosition += 10;

  // Table with borders
  const tableStartY = yPosition;
  const rowHeight = 15;
  const colWidths = [25, 20, 20, 20, 25, 20, 35];
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

  // Draw table border
  drawBox(15, tableStartY, tableWidth, rowHeight * (data.appliances.length + 1));

  // Table headers
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  const headers = ['Type', 'Location', 'Make', 'Model', 'Flue Type', 'Safe?', 'Defects/Remedial Action'];
  let xPos = 15;

  // Draw header row
  headers.forEach((header, index) => {
    if (index > 0) {
      pdf.line(xPos, tableStartY, xPos, tableStartY + rowHeight * (data.appliances.length + 1));
    }
    pdf.text(header, xPos + 2, tableStartY + 10);
    xPos += colWidths[index];
  });

  // Draw horizontal line under headers
  pdf.line(15, tableStartY + rowHeight, 15 + tableWidth, tableStartY + rowHeight);
  yPosition = tableStartY + rowHeight;

  // Appliance data
  pdf.setFont('helvetica', 'normal');
  data.appliances.forEach((appliance, rowIndex) => {
    xPos = 15;
    const rowData = [
      appliance.type,
      appliance.location,
      appliance.make,
      appliance.model,
      appliance.flueType,
      appliance.safetyCheck === 'Pass' ? '✓' : appliance.safetyCheck === 'Fail' ? '✗' : 'N/A',
      appliance.remedialAction || 'None'
    ];

    rowData.forEach((cellData, colIndex) => {
      const lines = pdf.splitTextToSize(cellData, colWidths[colIndex] - 4);
      pdf.text(lines, xPos + 2, yPosition + 10);
      xPos += colWidths[colIndex];
    });

    // Draw horizontal line after each row
    if (rowIndex < data.appliances.length - 1) {
      pdf.line(15, yPosition + rowHeight, 15 + tableWidth, yPosition + rowHeight);
    }
    yPosition += rowHeight;
  });

  yPosition += 15;

  // Additional Safety Checks Section
  checkNewPage(80);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('7. SAFETY CHECKS', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  // Safety checks table
  const checksTableY = yPosition;
  const checksRowHeight = 12;
  const checksData = [
    ['Gas supply pipework', data.gasSupplyPipework === 'Pass' ? '✓' : data.gasSupplyPipework === 'Fail' ? '✗' : 'N/A'],
    ['Gas meter installation', data.gasMetering === 'Pass' ? '✓' : data.gasMetering === 'Fail' ? '✗' : 'N/A'],
    ['Emergency controls', data.emergencyControls === 'Pass' ? '✓' : data.emergencyControls === 'Fail' ? '✗' : 'N/A'],
    ['Ventilation', data.ventilation === 'Pass' ? '✓' : data.ventilation === 'Fail' ? '✗' : 'N/A']
  ];

  drawBox(15, checksTableY, pageWidth - 30, checksRowHeight * checksData.length);

  checksData.forEach((check, index) => {
    const rowY = checksTableY + (index * checksRowHeight);
    pdf.text(check[0], 18, rowY + 8);
    pdf.text(check[1], pageWidth - 40, rowY + 8);

    if (index < checksData.length - 1) {
      pdf.line(15, rowY + checksRowHeight, pageWidth - 15, rowY + checksRowHeight);
    }
  });

  yPosition += checksRowHeight * checksData.length + 15;

  // Overall Assessment Section
  checkNewPage(60);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('8. OVERALL ASSESSMENT', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  drawBox(15, yPosition, pageWidth - 30, 20);
  pdf.text('Overall assessment of gas installation:', 18, yPosition + 8);

  // Assessment result with checkbox style
  const assessmentX = 18;
  const assessmentY = yPosition + 15;

  if (data.overallAssessment === 'Satisfactory') {
    pdf.rect(assessmentX, assessmentY - 3, 4, 4);
    pdf.text('✓', assessmentX + 1, assessmentY);
    pdf.text('SATISFACTORY', assessmentX + 8, assessmentY);

    pdf.rect(assessmentX + 80, assessmentY - 3, 4, 4);
    pdf.text('UNSATISFACTORY', assessmentX + 88, assessmentY);
  } else {
    pdf.rect(assessmentX, assessmentY - 3, 4, 4);
    pdf.text('SATISFACTORY', assessmentX + 8, assessmentY);

    pdf.rect(assessmentX + 80, assessmentY - 3, 4, 4);
    pdf.text('✓', assessmentX + 81, assessmentY);
    pdf.text('UNSATISFACTORY', assessmentX + 88, assessmentY);
  }

  yPosition += 25;

  if (data.additionalComments) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('9. ADDITIONAL COMMENTS', 15, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    drawBox(15, yPosition, pageWidth - 30, 25);
    yPosition = addText(data.additionalComments, 18, yPosition + 8, pageWidth - 36, 9);
    yPosition += 20;
  }

  // Signature Section
  checkNewPage(80);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('10. ENGINEER DECLARATION', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  const declarationText = 'I have carried out the above work in accordance with the Gas Safety (Installation and Use) Regulations 1998 and the appliances and installations are safe to use.';
  yPosition = addText(declarationText, 15, yPosition, pageWidth - 30, 9);
  yPosition += 15;

  // Engineer signature box
  drawBox(15, yPosition, pageWidth - 30, 35);
  pdf.text('Engineer Name:', 18, yPosition + 8);
  pdf.text(data.engineerName, 55, yPosition + 8);

  pdf.text('Gas Safe Registration No:', 18, yPosition + 16);
  pdf.text(data.engineerRegistration, 75, yPosition + 16);

  pdf.text('Signature:', 18, yPosition + 24);
  pdf.line(45, yPosition + 24, 120, yPosition + 24);

  pdf.text('Date:', 130, yPosition + 24);
  pdf.text(inspectionDateFormatted, 145, yPosition + 24);

  yPosition += 45;

  // Landlord acknowledgment
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('11. LANDLORD/AGENT ACKNOWLEDGMENT', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  drawBox(15, yPosition, pageWidth - 30, 25);
  pdf.text('I acknowledge receipt of this safety record:', 18, yPosition + 8);

  pdf.text('Signature:', 18, yPosition + 16);
  pdf.line(45, yPosition + 16, 120, yPosition + 16);

  pdf.text('Date:', 130, yPosition + 16);
  pdf.line(145, yPosition + 16, 180, yPosition + 16);

  yPosition += 35;

  // Footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  const footerText = 'This record must be retained by the landlord for 2 years and a copy given to the tenant within 28 days of the check.';
  pdf.text(footerText, pageWidth / 2, pageHeight - 15, { align: 'center' });

  pdf.setFontSize(7);
  const footerText2 = 'Generated electronically - valid without handwritten signature when printed immediately after completion.';
  pdf.text(footerText2, pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save the PDF
  const fileName = `Gas_Safety_Certificate_${inspectionDateFormatted.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
}
