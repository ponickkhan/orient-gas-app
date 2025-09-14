'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

interface ChecklistData {
  business: {
    companyAddress: string;
    postcode: string;
    telephone: string;
    mobile?: string;
    gasSafeEngineerNo: string;
    engineerName: string;
    licenseNo: string;
  };
  siteDetails: {
    siteAddress: string;
    postcode: string;
    accessInstructions?: string;
  };
  clientDetails: {
    clientName: string;
    contactNumber: string;
    email?: string;
  };
  installationDetails: {
    installationType: string;
    installationDate?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    satisfactoryMeterCylinder: 'PASS' | 'FAIL' | 'NA';
    inspectionVisiblePipework: 'PASS' | 'FAIL' | 'NA';
    ecvAccessOperation: 'PASS' | 'FAIL' | 'NA';
    protectiveEquipotentialBonding: 'PASS' | 'FAIL' | 'NA';
    tightnessTest: 'PASS' | 'FAIL' | 'NA';
  };
  applianceDetails: {
    applianceType: string;
    location: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    gasType?: string;
    inputRating?: string;
  };
  safetyChecks: {
    gasConnectionIsolation: 'PASS' | 'FAIL';
    electricalConnectionIsolation: 'PASS' | 'FAIL' | 'NA';
    waterConnectionIsolation: 'PASS' | 'FAIL' | 'NA';
    overallConditionStability: 'PASS' | 'FAIL';
    controlsOperation: 'PASS' | 'FAIL' | 'NA';
    visualInspectionHeatExchanger: 'PASS' | 'FAIL' | 'NA';
    burnerAndInjectors: 'PASS' | 'FAIL';
    fans: 'PASS' | 'FAIL' | 'NA';
    ignition: 'PASS' | 'FAIL';
    flamePicture: 'PASS' | 'FAIL' | 'NA';
    correctSafetyDevicesOperation: 'PASS' | 'FAIL';
    heatInputKwBtu?: string;
    operatingPressureMbar?: string;
    sealsIncludingApplianceCasing: 'PASS' | 'FAIL' | 'NA';
    condensateTrapDisposal: 'PASS' | 'FAIL' | 'NA';
    pressureTemperatureReliefValve: 'PASS' | 'FAIL' | 'NA';
    returnAirPlenum: 'PASS' | 'FAIL' | 'NA';
    fireplaceCatchmentSpaceClosurePlate: 'PASS' | 'FAIL' | 'NA';
    flueFlowSpillageTest: 'PASS' | 'FAIL' | 'NA';
    satisfactoryChimneyFlue: 'YES' | 'NO';
    satisfactoryVentilation: 'YES' | 'NO';
    finalCombustionAnalyserReading?: string;
    finalCombustionAnalyserNA?: boolean;
  };
  summaryNotes: {
    safeToUse: 'YES' | 'NO';
    giuspClassification: 'NONE' | 'AR' | 'ID';
    warningAdvisoryNoticeSerial?: string;
  };
  dateSection: {
    checksCompletedDate: string;
    nextServiceMaintenanceDate?: string;
  };
  signatures: {
    engineerSignature: boolean;
    engineerSerial: string;
    clientSignature: boolean;
    clientName?: string;
  };
}

function ChecklistContent() {
  const searchParams = useSearchParams();
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = atob(decodeURIComponent(dataParam));
        const parsedData = JSON.parse(decodedData);
        setChecklistData(parsedData);
      } catch (error) {
        console.error('Error parsing checklist data:', error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Auto-print when page loads
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!checklistData) {
    return <div>Loading checklist...</div>;
  }

  return (
    <>
      <style jsx global>{`
        @page { 
          size: A4; 
          margin: 6mm; 
        }
        
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 4px;
          color: #333;
          font-size: 7px;
          line-height: 1.1;
          background: #fff;
        }

        .checklist-container {
          max-width: 100%;
          margin: 0;
          padding: 0;
        }

        .checklist-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 6px;
          border-bottom: 1px solid #2e5aa6;
          padding-bottom: 4px;
        }

        .company-info {
          flex: 1;
        }

        .company-logo {
          width: 40px;
          height: 30px;
          object-fit: contain;
          margin-bottom: 2px;
        }

        .company-owner {
          font-size: 6px;
          color: #666;
          margin: 1px 0;
        }

        .checklist-title {
          text-align: right;
        }

        .checklist-title h1 {
          font-size: 14px;
          color: #2e5aa6;
          margin: 0;
          font-weight: bold;
        }

        .service-date {
          font-size: 8px;
          color: #666;
          margin: 1px 0;
        }

        .section {
          margin-bottom: 4px;
          page-break-inside: avoid;
        }

        .section h3 {
          background: #2e5aa6;
          color: white;
          padding: 1px 4px;
          margin: 0 0 2px 0;
          font-size: 7px;
          font-weight: bold;
        }

        .section-content {
          background: #f8fafc;
          border: 1px solid #e1e8f0;
          padding: 3px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 4px;
          font-size: 6px;
        }

        .details-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          font-size: 6px;
        }

        .field-group {
          margin-bottom: 2px;
        }

        .field-group label {
          font-weight: bold;
          color: #2e5aa6;
          font-size: 6px;
        }

        .safety-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 5px;
          margin: 2px 0;
        }

        .safety-table th {
          background: #cdd9f3;
          color: #2e5aa6;
          padding: 1px 2px;
          text-align: center;
          border: 1px solid #2e5aa6;
          font-size: 5px;
          font-weight: bold;
        }

        .safety-table td {
          padding: 1px 2px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 5px;
        }

        .safety-table td:first-child {
          text-align: left;
          font-size: 5px;
        }

        .status-pass {
          color: #28a745;
          font-weight: bold;
        }

        .status-fail {
          color: #dc3545;
          font-weight: bold;
        }

        .status-na {
          color: #6c757d;
        }

        .signature-section {
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          gap: 6px;
        }

        .signature-box {
          text-align: center;
          border: 1px solid #ddd;
          padding: 4px;
          flex: 1;
        }

        .signature-image {
          width: 60px;
          height: 15px;
          object-fit: contain;
          margin-bottom: 2px;
        }

        .signature-box p {
          font-size: 5px;
          margin: 1px 0;
        }

        .notes-section {
          background: #fff9e6;
          border: 1px solid #ffd700;
          padding: 3px;
          margin: 2px 0;
        }

        .notes-section h4 {
          margin: 0 0 2px 0;
          color: #b8860b;
          font-size: 6px;
          font-weight: bold;
        }

        .notes-section p {
          margin: 0;
          font-size: 5px;
        }

        @media print {
          body {
            padding: 0;
            font-size: 6px;
          }
          
          .checklist-container {
            transform: scale(0.95);
            transform-origin: top left;
          }
        }

        .safety-checks-grid {
          margin-top: 4px;
        }

        .safety-check-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1px 0;
          border-bottom: 1px solid #eee;
          font-size: 6px;
        }

        .check-label {
          font-weight: bold;
          flex: 1;
        }

        .check-result {
          font-weight: bold;
          padding: 1px 4px;
          border-radius: 2px;
          min-width: 30px;
          text-align: center;
          font-size: 5px;
        }

        .check-result.pass {
          background: #d4edda;
          color: #155724;
        }

        .check-result.fail {
          background: #f8d7da;
          color: #721c24;
        }

        .check-result.na {
          background: #fff3cd;
          color: #856404;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px solid #eee;
          font-size: 7px;
        }

        .summary-item label {
          font-weight: bold;
          flex: 1;
        }

        .status-badge {
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 6px;
          text-align: center;
          min-width: 30px;
        }

        .status-badge.yes {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.no {
          background: #f8d7da;
          color: #721c24;
        }

        .classification-badge {
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 6px;
          text-align: center;
          min-width: 30px;
        }

        .classification-badge.none {
          background: #e2e3e5;
          color: #383d41;
        }

        .classification-badge.ar {
          background: #fff3cd;
          color: #856404;
        }

        .classification-badge.id {
          background: #f8d7da;
          color: #721c24;
        }

        @media screen {
          body {
            background: #f5f5f5;
            padding: 10px;
          }

          .checklist-container {
            background: white;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 210mm;
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="checklist-container">
        <div className="checklist-header">
          <div className="company-info">
            <Image src="/logo.png" alt="Company Logo" width={40} height={30} className="company-logo" />
            <p className="company-owner">AKM ZAHURUL ISLAM</p>
          </div>
          <div className="checklist-title">
            <h1>SERVICE & MAINTENANCE CHECKLIST</h1>
            <p className="service-date">Date: {new Date(checklistData.dateSection.checksCompletedDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* 1. Business Section */}
        <div className="section">
          <h3>1. BUSINESS DETAILS</h3>
          <div className="section-content">
            <div className="details-grid">
              <div className="field-group">
                <label>Company Address:</label><br />
                {checklistData.business.companyAddress}
              </div>
              <div className="field-group">
                <label>Postcode:</label><br />
                {checklistData.business.postcode}
              </div>
              <div className="field-group">
                <label>Telephone:</label><br />
                {checklistData.business.telephone}
              </div>
              <div className="field-group">
                <label>Mobile:</label><br />
                {checklistData.business.mobile || 'N/A'}
              </div>
              <div className="field-group">
                <label>Gas Safe Engineer No:</label><br />
                {checklistData.business.gasSafeEngineerNo}
              </div>
              <div className="field-group">
                <label>Engineer Name:</label><br />
                {checklistData.business.engineerName}
              </div>
              <div className="field-group">
                <label>License No:</label><br />
                {checklistData.business.licenseNo}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Site Details */}
        <div className="section">
          <h3>2. SITE DETAILS</h3>
          <div className="section-content">
            <div className="details-grid-2">
              <div className="field-group">
                <label>Site Address:</label><br />
                {checklistData.siteDetails.siteAddress}
              </div>
              <div className="field-group">
                <label>Postcode:</label><br />
                {checklistData.siteDetails.postcode}
              </div>
              <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                <label>Access Instructions:</label><br />
                {checklistData.siteDetails.accessInstructions || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Client Details */}
        <div className="section">
          <h3>3. CLIENT DETAILS</h3>
          <div className="section-content">
            <div className="details-grid">
              <div className="field-group">
                <label>Client Name:</label><br />
                {checklistData.clientDetails.clientName}
              </div>
              <div className="field-group">
                <label>Contact Number:</label><br />
                {checklistData.clientDetails.contactNumber}
              </div>
              <div className="field-group">
                <label>Email:</label><br />
                {checklistData.clientDetails.email || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Installation Details */}
        <div className="section">
          <h3>4. INSTALLATION DETAILS</h3>
          <div className="section-content">
            <div className="details-grid">
              <div className="field-group">
                <label>Installation Type:</label><br />
                {checklistData.installationDetails.installationType}
              </div>
              <div className="field-group">
                <label>Installation Date:</label><br />
                {checklistData.installationDetails.installationDate || 'N/A'}
              </div>
              <div className="field-group">
                <label>Manufacturer:</label><br />
                {checklistData.installationDetails.manufacturer || 'N/A'}
              </div>
              <div className="field-group">
                <label>Model:</label><br />
                {checklistData.installationDetails.model || 'N/A'}
              </div>
              <div className="field-group">
                <label>Serial Number:</label><br />
                {checklistData.installationDetails.serialNumber || 'N/A'}
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <h4 style={{ fontSize: '8px', fontWeight: 'bold', margin: '4px 0', color: '#2e5aa6' }}>INSTALLATION SAFETY CHECKS</h4>
              <div className="safety-checks-grid">
                <div className="safety-check-row">
                  <span className="check-label">Satisfactory Meter/Cylinder:</span>
                  <span className={`check-result ${checklistData.installationDetails.satisfactoryMeterCylinder?.toLowerCase()}`}>
                    {checklistData.installationDetails.satisfactoryMeterCylinder || 'N/A'}
                  </span>
                </div>
                <div className="safety-check-row">
                  <span className="check-label">Inspection of Visible Pipework:</span>
                  <span className={`check-result ${checklistData.installationDetails.inspectionVisiblePipework?.toLowerCase()}`}>
                    {checklistData.installationDetails.inspectionVisiblePipework || 'N/A'}
                  </span>
                </div>
                <div className="safety-check-row">
                  <span className="check-label">ECV Access and Operation:</span>
                  <span className={`check-result ${checklistData.installationDetails.ecvAccessOperation?.toLowerCase()}`}>
                    {checklistData.installationDetails.ecvAccessOperation || 'N/A'}
                  </span>
                </div>
                <div className="safety-check-row">
                  <span className="check-label">Protective Equipotential Bonding:</span>
                  <span className={`check-result ${checklistData.installationDetails.protectiveEquipotentialBonding?.toLowerCase()}`}>
                    {checklistData.installationDetails.protectiveEquipotentialBonding || 'N/A'}
                  </span>
                </div>
                <div className="safety-check-row">
                  <span className="check-label">Tightness Test:</span>
                  <span className={`check-result ${checklistData.installationDetails.tightnessTest?.toLowerCase()}`}>
                    {checklistData.installationDetails.tightnessTest || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Appliance Details */}
        <div className="section">
          <h3>5. APPLIANCE DETAILS</h3>
          <div className="section-content">
            <div className="details-grid">
              <div className="field-group">
                <label>Appliance Type:</label><br />
                {checklistData.applianceDetails.applianceType}
              </div>
              <div className="field-group">
                <label>Location:</label><br />
                {checklistData.applianceDetails.location}
              </div>
              <div className="field-group">
                <label>Manufacturer:</label><br />
                {checklistData.applianceDetails.manufacturer || 'N/A'}
              </div>
              <div className="field-group">
                <label>Model:</label><br />
                {checklistData.applianceDetails.model || 'N/A'}
              </div>
              <div className="field-group">
                <label>Serial Number:</label><br />
                {checklistData.applianceDetails.serialNumber || 'N/A'}
              </div>
              <div className="field-group">
                <label>Gas Type:</label><br />
                {checklistData.applianceDetails.gasType || 'N/A'}
              </div>
              <div className="field-group">
                <label>Input Rating:</label><br />
                {checklistData.applianceDetails.inputRating || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Safety Checks */}
        <div className="section">
          <h3>6. SAFETY CHECKS</h3>
          <div className="section-content">
            <table className="safety-table">
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Check Item</th>
                  <th style={{ width: '13%' }}>PASS</th>
                  <th style={{ width: '13%' }}>FAIL</th>
                  <th style={{ width: '14%' }}>N/A</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'gasConnectionIsolation', label: 'APPLIANCE Gas Connection and Isolation' },
                  { key: 'electricalConnectionIsolation', label: 'Electrical Connection & Isolation' },
                  { key: 'waterConnectionIsolation', label: 'Water Connection & Isolation' },
                  { key: 'overallConditionStability', label: 'Overall Condition, Stability and Controls Operation' },
                  { key: 'controlsOperation', label: 'Controls Operation' },
                  { key: 'visualInspectionHeatExchanger', label: 'Visual Inspection of Heat Exchanger' },
                  { key: 'burnerAndInjectors', label: 'Burner and Injectors' },
                  { key: 'fans', label: 'Fans' },
                  { key: 'ignition', label: 'Ignition' },
                  { key: 'flamePicture', label: 'Flame Picture' },
                  { key: 'correctSafetyDevicesOperation', label: 'Correct Safety Device(s) Operation' },
                  { key: 'sealsIncludingApplianceCasing', label: 'Seals including Appliance Casing' },
                  { key: 'condensateTrapDisposal', label: 'Condensate Trap/Disposal' },
                  { key: 'pressureTemperatureReliefValve', label: 'Pressure/Temperature Relief Valve' },
                  { key: 'returnAirPlenum', label: 'Return Air/Plenum' },
                  { key: 'fireplaceCatchmentSpaceClosurePlate', label: 'Fireplace Catchment Space and Closure Plate' },
                  { key: 'flueFlowSpillageTest', label: 'Flue Flow & Spillage Test' }
                ].map((item) => {
                  const status = checklistData.safetyChecks[item.key as keyof typeof checklistData.safetyChecks];
                  return (
                    <tr key={item.key}>
                      <td>{item.label}</td>
                      <td className={status === 'PASS' ? 'status-pass' : ''}>{status === 'PASS' ? '✓' : ''}</td>
                      <td className={status === 'FAIL' ? 'status-fail' : ''}>{status === 'FAIL' ? '✓' : ''}</td>
                      <td className={status === 'NA' ? 'status-na' : ''}>{status === 'NA' ? '✓' : ''}</td>
                    </tr>
                  );
                })}

                {/* Satisfactory Chimney/Flue - Yes/No Display */}
                <tr>
                  <td>Satisfactory Chimney/Flue</td>
                  <td className={checklistData.safetyChecks.satisfactoryChimneyFlue === 'YES' ? 'status-pass' : ''}>
                    {checklistData.safetyChecks.satisfactoryChimneyFlue === 'YES' ? '✓' : ''}
                  </td>
                  <td className={checklistData.safetyChecks.satisfactoryChimneyFlue === 'NO' ? 'status-fail' : ''}>
                    {checklistData.safetyChecks.satisfactoryChimneyFlue === 'NO' ? '✓' : ''}
                  </td>
                  <td></td>
                </tr>

                {/* Satisfactory Ventilation - Yes/No Display */}
                <tr>
                  <td>Satisfactory Ventilation</td>
                  <td className={checklistData.safetyChecks.satisfactoryVentilation === 'YES' ? 'status-pass' : ''}>
                    {checklistData.safetyChecks.satisfactoryVentilation === 'YES' ? '✓' : ''}
                  </td>
                  <td className={checklistData.safetyChecks.satisfactoryVentilation === 'NO' ? 'status-fail' : ''}>
                    {checklistData.safetyChecks.satisfactoryVentilation === 'NO' ? '✓' : ''}
                  </td>
                  <td></td>
                </tr>

                {/* Heat Input/Operating Pressure - Custom Display */}
                <tr>
                  <td>Heat Input/Operating Pressure</td>
                  <td colSpan={3} style={{ textAlign: 'left', fontSize: '6px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span><strong>KW/BTU:</strong> {checklistData.safetyChecks.heatInputKwBtu || 'N/A'}</span>
                      <span><strong>mbar:</strong> {checklistData.safetyChecks.operatingPressureMbar || 'N/A'}</span>
                    </div>
                  </td>
                </tr>

                {/* Final Combustion Analyser Reading - Custom Display */}
                <tr>
                  <td>Final Combustion Analyser Reading</td>
                  <td colSpan={3} style={{ textAlign: 'left', fontSize: '6px' }}>
                    {checklistData.safetyChecks.finalCombustionAnalyserNA ?
                      <span className="status-na">N/A</span> :
                      <span>{checklistData.safetyChecks.finalCombustionAnalyserReading || 'N/A'}</span>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Summary and Notes */}
        <div className="section">
          <h3>7. SUMMARY AND NOTES</h3>
          <div className="section-content">
            <div className="summary-grid">
              <div className="summary-item">
                <label>Safe to Use:</label>
                <span className={`status-badge ${checklistData.summaryNotes.safeToUse?.toLowerCase()}`}>
                  {checklistData.summaryNotes.safeToUse || 'N/A'}
                </span>
              </div>
              <div className="summary-item">
                <label>GIUSP Classification:</label>
                <span className={`classification-badge ${checklistData.summaryNotes.giuspClassification?.toLowerCase()}`}>
                  {checklistData.summaryNotes.giuspClassification || 'N/A'}
                </span>
              </div>
              <div className="summary-item">
                <label>Warning/Advisory Notice - Serial No:</label>
                <span>{checklistData.summaryNotes.warningAdvisoryNoticeSerial || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Date Section */}
        <div className="section">
          <h3>8. DATE SECTION</h3>
          <div className="section-content">
            <div className="details-grid-2">
              <div className="field-group">
                <label>Checks Completed Date:</label><br />
                {new Date(checklistData.dateSection.checksCompletedDate).toLocaleDateString()}
              </div>
              <div className="field-group">
                <label>Next Service/Maintenance Date:</label><br />
                {checklistData.dateSection.nextServiceMaintenanceDate ?
                  new Date(checklistData.dateSection.nextServiceMaintenanceDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* 9. Signatures */}
        <div className="section">
          <h3>9. SIGNATURES</h3>
          <div className="signature-section">
            <div className="signature-box">
              <Image src="/signature.png" alt="Engineer Signature" width={60} height={15} className="signature-image" />
              <p><strong>{checklistData.business.engineerName}</strong></p>
              <p>Gas Safe Engineer</p>
              <p>Reg No: {checklistData.business.gasSafeEngineerNo}</p>
              <p>Serial: {checklistData.signatures.engineerSerial}</p>
              <p>Date: {new Date(checklistData.dateSection.checksCompletedDate).toLocaleDateString()}</p>
            </div>
            <div className="signature-box">
              <div style={{ height: '15px', borderBottom: '1px solid #333', marginBottom: '2px' }}></div>
              <p><strong>Client Signature</strong></p>
              <p>{checklistData.signatures.clientName || 'Client Name'}</p>
              <p>Date: _______________</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={<div>Loading checklist...</div>}>
      <ChecklistContent />
    </Suspense>
  );
}
