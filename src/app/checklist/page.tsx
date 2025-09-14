'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

function StatusBadge({ status }: { status: 'PASS' | 'FAIL' | 'NA' | 'YES' | 'NO' }) {
  const getVariant = () => {
    if (status === 'PASS' || status === 'YES') return 'default';
    if (status === 'FAIL' || status === 'NO') return 'destructive';
    return 'secondary';
  };
  
  const getCustomStyle = () => {
    if (status === 'PASS' || status === 'YES') {
      return { 
        backgroundColor: '#d2af6c', 
        color: '#24476c',
        border: '1px solid #e6913c'
      };
    }
    if (status === 'FAIL' || status === 'NO') {
      return { 
        backgroundColor: '#ef4444', 
        color: 'white',
        border: '1px solid #dc2626'
      };
    }
    return { 
      backgroundColor: '#89a6c1', 
      color: '#24476c',
      border: '1px solid #4a4987'
    };
  };
  
  return (
    <Badge 
      variant={getVariant()} 
      style={getCustomStyle()}
      className="text-xs font-semibold px-3 py-1 rounded-full"
    >
      {status}
    </Badge>
  );
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
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!checklistData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-[#24476c]">Loading checklist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#24476c]">
      <style jsx global>{`
        @page { 
          size: A4; 
          margin: 8mm; 
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          padding: 0;
          color: #24476c;
          font-size: 10px;
          line-height: 1.4;
          background: #fff;
        }

        .print-container {
          max-width: 100%;
          margin: 0;
          padding: 12px;
          background: #ffffff;
        }

        .header-section {
          background: linear-gradient(135deg, #f5d49c 0%, #d2af6c 100%);
          border: 3px solid #e6913c;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(230, 145, 60, 0.15);
        }

        .section-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #e6913c;
          border-radius: 12px;
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          page-break-inside: avoid;
        }

        .section-header {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
          color: white;
          padding: 16px 24px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .section-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #e6913c 0%, #e4903e 100%);
        }

        .section-content {
          background: linear-gradient(135deg, #ffffff 0%, rgba(245, 212, 156, 0.1) 100%);
          padding: 24px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          font-size: 11px;
        }

        .details-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          font-size: 11px;
        }

        .field-group {
          background: linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(245, 212, 156, 0.1) 100%);
          border: 2px solid #d2af6c;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(210, 175, 108, 0.15);
        }

        .field-group:hover {
          background: linear-gradient(135deg, rgba(245, 212, 156, 0.4) 0%, rgba(245, 212, 156, 0.2) 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(210, 175, 108, 0.25);
        }

        .field-label {
          font-weight: 800;
          color: #24476c;
          font-size: 10px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .field-value {
          color: #4a4987;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
        }

        .safety-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin: 0;
          background: linear-gradient(135deg, #ffffff 0%, rgba(137, 166, 193, 0.05) 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(36, 71, 108, 0.12);
        }

        .safety-table th {
          background: linear-gradient(135deg, #24476c 0%, #4a4987 100%);
          color: white;
          padding: 16px 12px;
          text-align: center;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .safety-table td {
          padding: 14px 12px;
          border-bottom: 2px solid rgba(230, 145, 60, 0.2);
          text-align: center;
          font-size: 10px;
          transition: background-color 0.3s ease;
        }

        .safety-table td:first-child {
          text-align: left;
          font-weight: 700;
          color: #24476c;
          background: linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(245, 212, 156, 0.1) 100%);
          border-right: 2px solid #d2af6c;
        }

        .safety-table tr:hover {
          background: linear-gradient(135deg, rgba(245, 212, 156, 0.2) 0%, rgba(137, 166, 193, 0.1) 100%);
        }

        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }

        .signature-box {
          text-align: center;
          border: 3px solid #89a6c1;
          border-radius: 16px;
          padding: 24px;
          background: linear-gradient(135deg, #ffffff 0%, rgba(137, 166, 193, 0.1) 100%);
          box-shadow: 0 8px 24px rgba(137, 166, 193, 0.15);
        }

        .signature-image {
          width: 120px;
          height: 40px;
          object-fit: contain;
          margin-bottom: 12px;
          border-bottom: 3px solid #4a4987;
          padding-bottom: 8px;
        }

        .signature-text {
          font-size: 10px;
          margin: 4px 0;
          color: #24476c;
          font-weight: 600;
        }

        .signature-text.name {
          font-weight: 800;
          font-size: 13px;
          color: #4a4987;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .summary-grid {
          display: grid;
          gap: 16px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          background: linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(137, 166, 193, 0.1) 100%);
          border: 2px solid #e6913c;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(230, 145, 60, 0.15);
        }

        .summary-label {
          font-weight: 800;
          color: #24476c;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .installation-checks {
          margin-top: 20px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(245, 212, 156, 0.2) 0%, rgba(137, 166, 193, 0.1) 100%);
          border: 2px solid #d2af6c;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(210, 175, 108, 0.15);
        }

        .installation-checks h4 {
          font-size: 13px;
          font-weight: 800;
          color: #24476c;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .check-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 12px 0;
          border-bottom: 2px solid rgba(230, 145, 60, 0.2);
        }

        .check-grid:last-child {
          border-bottom: none;
        }

        .check-label {
          font-weight: 700;
          color: #24476c;
          font-size: 11px;
        }

        .status-pass {
          color: #22c55e;
          font-weight: bold;
          font-size: 16px;
        }

        .status-fail {
          color: #ef4444;
          font-weight: bold;
          font-size: 16px;
        }

        .status-na {
          color: #6b7280;
          font-weight: bold;
          font-size: 16px;
        }

        @media print {
          body {
            font-size: 9px;
          }
          
          .print-container {
            padding: 0;
            transform: scale(0.95);
            transform-origin: top left;
          }

          .section-card {
            margin-bottom: 12px;
            box-shadow: none;
          }

          .section-content {
            padding: 16px;
          }

          .field-group {
            padding: 12px;
          }

          .signature-box {
            padding: 16px;
          }
        }
      `}</style>

            <div className="max-w-full mx-auto p-3 bg-white print:p-0 print-scale">
        {/* Header */}
        <div 
          className="rounded-2xl p-6 mb-6 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #e6913c 0%, #e4903e 100%)',
              borderRadius: '0 0 16px 16px'
            }}
          />
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-start gap-6">
              <Image 
                src="/logo.png" 
                alt="Company Logo" 
                width={100} 
                height={80} 
                className="object-contain rounded-lg shadow-lg border-2 border-white" 
              />
              <div>
                <div className="font-bold text-2xl mb-2 text-white">AKM ZAHURUL ISLAM</div>
                <div className="text-lg font-semibold text-gray-200">Gas Safe Registered Engineer</div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                SERVICE & MAINTENANCE CHECKLIST
              </h1>
              <div 
                className="text-lg font-semibold px-4 py-2 rounded-lg text-gray-700"
                style={{backgroundColor: '#ffffff', border: '2px solid #e6913c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              >
                Date: {new Date(checklistData.dateSection.checksCompletedDate).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div 
          className="mb-5 rounded-2xl overflow-hidden shadow-lg"
          style={{
            background: '#ffffff',
            border: '2px solid #e6913c',
            boxShadow: '0 8px 24px rgba(36, 71, 108, 0.12)'
          }}
        >
          <div 
            className="text-white p-4 font-bold text-sm uppercase tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #24476c 0%, #4a4987 100%)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            1. Business Details
          </div>
          <div 
            className="p-6"
            style={{background: 'linear-gradient(135deg, #ffffff 0%, rgba(245, 212, 156, 0.1) 100%)'}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Company Address', value: checklistData.business.companyAddress },
                { label: 'Postcode', value: checklistData.business.postcode },
                { label: 'Telephone', value: checklistData.business.telephone },
                { label: 'Mobile', value: checklistData.business.mobile || 'N/A' },
                { label: 'Gas Safe Engineer No', value: checklistData.business.gasSafeEngineerNo },
                { label: 'Engineer Name', value: checklistData.business.engineerName },
                { label: 'License No', value: checklistData.business.licenseNo }
              ].map((field, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(245, 212, 156, 0.1) 100%)',
                    border: '2px solid #d2af6c',
                    boxShadow: '0 4px 12px rgba(210, 175, 108, 0.15)'
                  }}
                >
                  <div className="font-bold text-[#24476c] text-xs mb-2 uppercase tracking-wide">{field.label}</div>
                  <div className="text-[#4a4987] text-sm font-semibold">{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Site Details */}
        <div 
          className="mb-5 rounded-2xl overflow-hidden shadow-lg"
          style={{
            background: '#ffffff',
            border: '2px solid #e6913c',
            boxShadow: '0 8px 24px rgba(36, 71, 108, 0.12)'
          }}
        >
          <div 
            className="text-white p-4 font-bold text-sm uppercase tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #24476c 0%, #4a4987 100%)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            2. Site Details
          </div>
          <div 
            className="p-6"
            style={{background: 'linear-gradient(135deg, #ffffff 0%, rgba(245, 212, 156, 0.1) 100%)'}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(245, 212, 156, 0.1) 100%)',
                  border: '2px solid #d2af6c'
                }}
              >
                <div className="font-bold text-[#24476c] text-xs mb-2 uppercase tracking-wide">Site Address</div>
                <div className="text-[#4a4987] text-sm font-semibold">{checklistData.siteDetails.siteAddress}</div>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(245, 212, 156, 0.1) 100%)',
                  border: '2px solid #d2af6c'
                }}
              >
                <div className="font-bold text-[#24476c] text-xs mb-2 uppercase tracking-wide">Postcode</div>
                <div className="text-[#4a4987] text-sm font-semibold">{checklistData.siteDetails.postcode}</div>
              </div>
            </div>
            {checklistData.siteDetails.accessInstructions && (
              <div 
                className="p-4 rounded-xl mt-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 212, 156, 0.3) 0%, rgba(245, 212, 156, 0.1) 100%)',
                  border: '2px solid #d2af6c'
                }}
              >
                <div className="font-bold text-[#24476c] text-xs mb-2 uppercase tracking-wide">Access Instructions</div>
                <div className="text-[#4a4987] text-sm font-semibold">{checklistData.siteDetails.accessInstructions}</div>
              </div>
            )}
          </div>
        </div>

        {/* Client Details */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>3. Client Details</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
            <div className="details-grid">
              {[
                { label: 'Client Name', value: checklistData.clientDetails.clientName },
                { label: 'Contact Number', value: checklistData.clientDetails.contactNumber },
                { label: 'Email', value: checklistData.clientDetails.email || 'N/A' }
              ].map((field, index) => (
                <div key={index} className="field-group">
                  <div className="field-label">{field.label}</div>
                  <div className="field-value">{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Installation Details */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>4. Installation Details</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
            <div className="details-grid">
              {[
                { label: 'Installation Type', value: checklistData.installationDetails.installationType },
                { label: 'Installation Date', value: checklistData.installationDetails.installationDate || 'N/A' },
                { label: 'Manufacturer', value: checklistData.installationDetails.manufacturer || 'N/A' },
                { label: 'Model', value: checklistData.installationDetails.model || 'N/A' },
                { label: 'Serial Number', value: checklistData.installationDetails.serialNumber || 'N/A' }
              ].map((field, index) => (
                <div key={index} className="field-group">
                  <div className="field-label">{field.label}</div>
                  <div className="field-value">{field.value}</div>
                </div>
              ))}
            </div>

            <div className="installation-checks">
              <h4>Installation Safety Checks</h4>
              {[
                { key: 'satisfactoryMeterCylinder', label: 'Satisfactory Meter/Cylinder' },
                { key: 'inspectionVisiblePipework', label: 'Inspection of Visible Pipework' },
                { key: 'ecvAccessOperation', label: 'ECV Access and Operation' },
                { key: 'protectiveEquipotentialBonding', label: 'Protective Equipotential Bonding' },
                { key: 'tightnessTest', label: 'Tightness Test' }
              ].map((item) => {
                const status = checklistData.installationDetails[item.key as keyof typeof checklistData.installationDetails] as string;
                return (
                  <div key={item.key} className="check-grid">
                    <div className="check-label">{item.label}</div>
                    <StatusBadge status={status as 'PASS' | 'FAIL' | 'NA'} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Appliance Details */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>5. Appliance Details</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
            <div className="details-grid">
              {[
                { label: 'Appliance Type', value: checklistData.applianceDetails.applianceType },
                { label: 'Location', value: checklistData.applianceDetails.location },
                { label: 'Manufacturer', value: checklistData.applianceDetails.manufacturer || 'N/A' },
                { label: 'Model', value: checklistData.applianceDetails.model || 'N/A' },
                { label: 'Serial Number', value: checklistData.applianceDetails.serialNumber || 'N/A' },
                { label: 'Gas Type', value: checklistData.applianceDetails.gasType || 'N/A' },
                { label: 'Input Rating', value: checklistData.applianceDetails.inputRating || 'N/A' }
              ].map((field, index) => (
                <div key={index} className="field-group">
                  <div className="field-label">{field.label}</div>
                  <div className="field-value">{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Checks */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>6. Safety Checks</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
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
                  const status = checklistData.safetyChecks[item.key as keyof typeof checklistData.safetyChecks] as string;
                  return (
                    <tr key={item.key}>
                      <td>{item.label}</td>
                      <td className={status === 'PASS' ? 'status-pass' : ''}>{status === 'PASS' ? '✓' : ''}</td>
                      <td className={status === 'FAIL' ? 'status-fail' : ''}>{status === 'FAIL' ? '✓' : ''}</td>
                      <td className={status === 'NA' ? 'status-na' : ''}>{status === 'NA' ? '✓' : ''}</td>
                    </tr>
                  );
                })}

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

                <tr>
                  <td>Heat Input/Operating Pressure</td>
                  <td colSpan={3} style={{ textAlign: 'left', fontSize: '10px', fontWeight: '600' }}>
                    <div className="flex gap-6">
                      <span style={{color: '#24476c'}}><strong>KW/BTU:</strong> {checklistData.safetyChecks.heatInputKwBtu || 'N/A'}</span>
                      <span style={{color: '#24476c'}}><strong>mbar:</strong> {checklistData.safetyChecks.operatingPressureMbar || 'N/A'}</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Final Combustion Analyser Reading</td>
                  <td colSpan={3} style={{ textAlign: 'left', fontSize: '10px', fontWeight: '600' }}>
                    {checklistData.safetyChecks.finalCombustionAnalyserNA ?
                      <span className="status-na">N/A</span> :
                      <span style={{color: '#24476c'}}>{checklistData.safetyChecks.finalCombustionAnalyserReading || 'N/A'}</span>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>7. Summary and Notes</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Safe to Use</div>
                <StatusBadge status={checklistData.summaryNotes.safeToUse as 'YES' | 'NO'} />
              </div>
              <div className="summary-item">
                <div className="summary-label">GIUSP Classification</div>
                <Badge 
                  variant="secondary" 
                  className="font-semibold"
                  style={{backgroundColor: '#89a6c1', color: '#24476c', border: '1px solid #4a4987'}}
                >
                  {checklistData.summaryNotes.giuspClassification || 'N/A'}
                </Badge>
              </div>
              <div className="summary-item">
                <div className="summary-label">Warning/Advisory Notice - Serial No</div>
                <div className="text-sm font-semibold" style={{color: '#4a4987'}}>{checklistData.summaryNotes.warningAdvisoryNoticeSerial || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Section */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>8. Date Section</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
            <div className="details-grid-2">
              <div className="field-group">
                <div className="field-label">Checks Completed Date</div>
                <div className="field-value">{new Date(checklistData.dateSection.checksCompletedDate).toLocaleDateString('en-GB')}</div>
              </div>
              <div className="field-group">
                <div className="field-label">Next Service/Maintenance Date</div>
                <div className="field-value">
                  {checklistData.dateSection.nextServiceMaintenanceDate ?
                    new Date(checklistData.dateSection.nextServiceMaintenanceDate).toLocaleDateString('en-GB') : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signatures */}
        <Card className="section-card">
          <CardHeader className="section-header">
            <CardTitle>9. Signatures</CardTitle>
          </CardHeader>
          <CardContent className="section-content">
            <div className="signature-section">
              <div className="signature-box">
                <Image 
                  src="/signature.png" 
                  alt="Engineer Signature" 
                  width={120} 
                  height={40} 
                  className="signature-image" 
                />
                <div className="signature-text name">{checklistData.business.engineerName}</div>
                <div className="signature-text">Gas Safe Engineer</div>
                <div className="signature-text">Reg No: {checklistData.business.gasSafeEngineerNo}</div>
                <div className="signature-text">Serial: {checklistData.signatures.engineerSerial}</div>
                <div className="signature-text">Date: {new Date(checklistData.dateSection.checksCompletedDate).toLocaleDateString('en-GB')}</div>
              </div>
              <div className="signature-box">
                <div style={{ height: '40px', borderBottom: '3px solid #4a4987', marginBottom: '12px' }}></div>
                <div className="signature-text name">Client Signature</div>
                <div className="signature-text">{checklistData.signatures.clientName || 'Client Name'}</div>
                <div className="signature-text">Date: _______________</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium" style={{color: '#24476c'}}>Loading checklist...</div>
      </div>
    }>
      <ChecklistContent />
    </Suspense>
  );
}
