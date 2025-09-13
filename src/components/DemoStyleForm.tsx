'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, RotateCcw, Printer, Receipt, CheckSquare } from 'lucide-react';
import Image from 'next/image';

// Form validation schema matching demo.html structure
const gasSafetySchema = z.object({
  // Header fields
  date: z.string().min(1, 'Date is required'),
  ref: z.string().optional(),
  serialNo: z.string().optional(),
  gasSafeRegNo: z.string().min(1, 'Gas Safe registration number is required'),
  
  // Registered Business Details
  businessName: z.string().min(1, 'Business name is required'),
  businessAddress1: z.string().min(1, 'Business address is required'),
  businessAddress2: z.string().optional(),
  businessAddress3: z.string().optional(),
  businessPostcode: z.string().min(1, 'Business postcode is required'),
  businessContact: z.string().min(1, 'Business contact is required'),
  
  // Landlord/Homeowner Details
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress1: z.string().min(1, 'Landlord address is required'),
  landlordAddress2: z.string().optional(),
  landlordAddress3: z.string().optional(),
  landlordAddress4: z.string().optional(),
  landlordPostcode: z.string().min(1, 'Landlord postcode is required'),
  landlordContact: z.string().min(1, 'Landlord contact is required'),
  
  // Site Details
  siteName: z.string().min(1, 'Site name is required'),
  siteAddress1: z.string().min(1, 'Site address is required'),
  siteAddress2: z.string().optional(),
  siteAddress3: z.string().optional(),
  siteAddress4: z.string().optional(),
  sitePostcode: z.string().min(1, 'Site postcode is required'),
  siteContact: z.string().min(1, 'Site contact is required'),
  
  // Appliances
  appliances: z.array(z.object({
    location: z.string().min(1, 'Location is required'),
    type: z.string().min(1, 'Type is required'),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    model: z.string().optional(),
    ownedByLandlord: z.string().min(1, 'Ownership is required'),
    applianceInspected: z.string().min(1, 'Inspection status is required'),
    flueType: z.string().min(1, 'Flue type is required'),
    outcome: z.string().min(1, 'Outcome is required'),
    operatingPressure: z.string().optional(),
    safetyDevices: z.string().optional(),
    ventilation: z.string().optional(),
    flueCondition: z.string().optional(),
    flueOperation: z.string().optional(),
    combustionReading: z.string().optional(),
    wasServiced: z.string().optional(),
    safeToUse: z.string().optional(),
    visualOnly: z.string().optional(),
  })).min(1, 'At least one appliance is required'),
  
  // Final checks
  gasTightnessTest: z.string().min(1, 'Gas tightness test result is required'),
  bondingSatisfactory: z.string().min(1, 'Bonding status is required'),
  emergencyControlAccessible: z.string().min(1, 'Emergency control status is required'),
  pipeworkInspection: z.string().min(1, 'Pipework inspection result is required'),
  coAlarmFitted: z.string().min(1, 'CO alarm status is required'),
  smokeAlarmFitted: z.string().min(1, 'Smoke alarm status is required'),
  
  // Additional fields
  notes: z.string().optional(),
  coLow: z.string().optional(),
  coHigh: z.string().optional(),
  co2Low: z.string().optional(),
  co2High: z.string().optional(),
  defectsIdentified: z.string().optional(),
  remedialWork: z.string().optional(),
  labelWarning: z.string().optional(),
  nextInspectionDate: z.string().min(1, 'Next inspection date is required'),
  
  // Signatures
  engineerName: z.string().min(1, 'Engineer name is required'),
  engineerLicence: z.string().min(1, 'Engineer licence is required'),
  engineerDate: z.string().min(1, 'Engineer date is required'),
  receivedByName: z.string().optional(),
  receivedByPosition: z.string().optional(),
  receivedByDate: z.string().optional(),
});

type GasSafetyData = z.infer<typeof gasSafetySchema>;

// Invoice schema
const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),

  // Customer details
  customerName: z.string().min(1, 'Customer name is required'),
  customerAddress: z.string().min(1, 'Customer address is required'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().optional(),

  // Invoice items
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    rate: z.number().min(0, 'Rate must be positive'),
    amount: z.number().min(0, 'Amount must be positive')
  })).min(1, 'At least one item is required'),

  // Totals
  subtotal: z.number().min(0),
  vatRate: z.number().min(0).max(100),
  vatAmount: z.number().min(0),
  total: z.number().min(0),

  // Payment details
  paymentTerms: z.string().optional(),
  notes: z.string().optional()
});

type InvoiceData = z.infer<typeof invoiceSchema>;

// Service and Maintenance Checklist schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checklistSchema = z.object({
  // 1. Business Section
  business: z.object({
    companyAddress: z.string().min(1, 'Company address is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    telephone: z.string().min(1, 'Telephone is required'),
    mobile: z.string().optional(),
    gasSafeEngineerNo: z.string().min(1, 'Gas Safe engineer number is required'),
    engineerName: z.string().min(1, 'Engineer name is required'),
    licenseNo: z.string().min(1, 'License number is required')
  }),

  // 2. Site Details
  siteDetails: z.object({
    siteAddress: z.string().min(1, 'Site address is required'),
    postcode: z.string().min(1, 'Site postcode is required'),
    accessInstructions: z.string().optional()
  }),

  // 3. Client Details
  clientDetails: z.object({
    clientName: z.string().min(1, 'Client name is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    email: z.string().optional()
  }),

  // 4. Installation Details
  installationDetails: z.object({
    installationType: z.string().min(1, 'Installation type is required'),
    installationDate: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    serialNumber: z.string().optional()
  }),

  // 5. Appliance Details
  applianceDetails: z.object({
    applianceType: z.string().min(1, 'Appliance type is required'),
    location: z.string().min(1, 'Location is required'),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    serialNumber: z.string().optional(),
    gasType: z.string().optional(),
    inputRating: z.string().optional()
  }),

  // 6. Safety Checks (Pass/Fail/N/A)
  safetyChecks: z.object({
    gasConnectionIsolation: z.enum(['PASS', 'FAIL', 'NA']),
    electricalConnectionIsolation: z.enum(['PASS', 'FAIL', 'NA']),
    waterConnectionIsolation: z.enum(['PASS', 'FAIL', 'NA']),
    overallConditionStability: z.enum(['PASS', 'FAIL', 'NA']),
    controlsOperation: z.enum(['PASS', 'FAIL', 'NA']),
    visualInspectionHeatExchanger: z.enum(['PASS', 'FAIL', 'NA']),
    burnerAndInjectors: z.enum(['PASS', 'FAIL', 'NA']),
    fans: z.enum(['PASS', 'FAIL', 'NA']),
    ignition: z.enum(['PASS', 'FAIL', 'NA']),
    flamePicture: z.enum(['PASS', 'FAIL', 'NA']),
    correctSafetyDevicesOperation: z.enum(['PASS', 'FAIL', 'NA']),
    heatInputOperatingPressure: z.enum(['PASS', 'FAIL', 'NA']),
    sealsIncludingApplianceCasing: z.enum(['PASS', 'FAIL', 'NA']),
    condensateTrapDisposal: z.enum(['PASS', 'FAIL', 'NA']),
    pressureTemperatureReliefValve: z.enum(['PASS', 'FAIL', 'NA']),
    returnAirPlenum: z.enum(['PASS', 'FAIL', 'NA']),
    fireplaceCatchmentSpaceClosurePlate: z.enum(['PASS', 'FAIL', 'NA']),
    flueFlowSpillageTest: z.enum(['PASS', 'FAIL', 'NA']),
    satisfactoryChimneyFlue: z.enum(['PASS', 'FAIL', 'NA']),
    satisfactoryVentilation: z.enum(['PASS', 'FAIL', 'NA']),
    finalCombustionAnalyserReading: z.enum(['PASS', 'FAIL', 'NA'])
  }),

  // 7. Summary and Notes
  summaryNotes: z.object({
    workCarriedOut: z.string().optional(),
    defectsFound: z.string().optional(),
    recommendedActions: z.string().optional(),
    additionalNotes: z.string().optional()
  }),

  // 8. Date Section
  dateSection: z.object({
    checksCompletedDate: z.string().min(1, 'Checks completed date is required'),
    nextServiceMaintenanceDate: z.string().optional()
  }),

  // 9. Signatures
  signatures: z.object({
    engineerSignature: z.boolean().default(true),
    engineerSerial: z.string().min(1, 'Engineer serial is required'),
    clientSignature: z.boolean().default(false),
    clientName: z.string().optional()
  })
});

type ChecklistData = z.infer<typeof checklistSchema>;

export default function DemoStyleForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  
  const { register, handleSubmit, control, reset } = useForm<GasSafetyData>({
    resolver: zodResolver(gasSafetySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      serialNo: 'GAUK00764057',
      gasSafeRegNo: '927879',
      businessName: 'Orient Gas Engineers LTD',
      businessAddress1: '45 Chalk Pit Avenue',
      businessAddress2: 'Orpington',
      businessAddress3: 'Kent',
      businessPostcode: 'BR5 3JJ',
      businessContact: '+44 7795 999196',
      landlordName: 'Caroline Dowey',
      landlordAddress1: 'Flat 15',
      landlordAddress2: '154 Goswell Road',
      landlordAddress3: 'London',
      landlordAddress4: 'UK',
      landlordPostcode: 'EC1V 7DX',
      landlordContact: '07886 879176',
      siteName: 'Mr Vojtech Dvorak',
      siteAddress1: 'Flat 15',
      siteAddress2: '154 Goswell Road',
      siteAddress3: 'London',
      siteAddress4: 'UK',
      sitePostcode: 'EC1V 7DX',
      siteContact: '07886 879176',
      appliances: [{
        location: 'Kitchen',
        type: 'Cooker',
        manufacturer: 'Bauknecht',
        model: '',
        ownedByLandlord: 'No',
        applianceInspected: 'Yes',
        flueType: 'Flueless',
        outcome: 'Pass',
        operatingPressure: '20mb kW/h',
        safetyDevices: 'Yes',
        ventilation: 'Yes',
        flueCondition: 'Pass',
        flueOperation: 'Pass',
        combustionReading: 'N/A',
        wasServiced: 'No',
        safeToUse: 'Yes',
        visualOnly: 'Yes',
      }],
      gasTightnessTest: 'Pass',
      bondingSatisfactory: 'Yes',
      emergencyControlAccessible: 'Yes',
      pipeworkInspection: 'Yes',
      coAlarmFitted: 'Yes',
      smokeAlarmFitted: 'N/A',
      coLow: 'N/A',
      coHigh: 'N/A',
      co2Low: 'N/A',
      co2High: 'N/A',
      nextInspectionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      engineerName: 'AKM ZAHURUL Islam',
      engineerLicence: '5388937',
      engineerDate: new Date().toISOString().split('T')[0],
      receivedByName: 'Elena',
      receivedByDate: new Date().toISOString().split('T')[0],
    }
  });

  const { fields: applianceFields, append: appendAppliance } = useFieldArray({
    control,
    name: 'appliances'
  });

  // Invoice form setup
  const invoiceForm = useForm<InvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      items: [{ description: 'Gas Safety Certificate', quantity: 1, rate: 150, amount: 150 }],
      subtotal: 150,
      vatRate: 20,
      vatAmount: 30,
      total: 180,
      paymentTerms: '30 days',
      notes: 'Thank you for your business!'
    }
  });

  const { fields: invoiceItems, append: appendInvoiceItem, remove: removeInvoiceItem } = useFieldArray({
    control: invoiceForm.control,
    name: 'items'
  });

  // Checklist form setup
  const checklistForm = useForm<ChecklistData>({
    // resolver: zodResolver(checklistSchema), // Temporarily disabled due to type conflicts
    defaultValues: {
      business: {
        companyAddress: '',
        postcode: '',
        telephone: '',
        mobile: '',
        gasSafeEngineerNo: '',
        engineerName: '',
        licenseNo: ''
      },
      siteDetails: {
        siteAddress: '',
        postcode: '',
        accessInstructions: ''
      },
      clientDetails: {
        clientName: '',
        contactNumber: '',
        email: ''
      },
      installationDetails: {
        installationType: '',
        installationDate: '',
        manufacturer: '',
        model: '',
        serialNumber: ''
      },
      applianceDetails: {
        applianceType: '',
        location: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        gasType: '',
        inputRating: ''
      },
      safetyChecks: {
        gasConnectionIsolation: 'NA',
        electricalConnectionIsolation: 'NA',
        waterConnectionIsolation: 'NA',
        overallConditionStability: 'NA',
        controlsOperation: 'NA',
        visualInspectionHeatExchanger: 'NA',
        burnerAndInjectors: 'NA',
        fans: 'NA',
        ignition: 'NA',
        flamePicture: 'NA',
        correctSafetyDevicesOperation: 'NA',
        heatInputOperatingPressure: 'NA',
        sealsIncludingApplianceCasing: 'NA',
        condensateTrapDisposal: 'NA',
        pressureTemperatureReliefValve: 'NA',
        returnAirPlenum: 'NA',
        fireplaceCatchmentSpaceClosurePlate: 'NA',
        flueFlowSpillageTest: 'NA',
        satisfactoryChimneyFlue: 'NA',
        satisfactoryVentilation: 'NA',
        finalCombustionAnalyserReading: 'NA'
      },
      summaryNotes: {
        workCarriedOut: '',
        defectsFound: '',
        recommendedActions: '',
        additionalNotes: ''
      },
      dateSection: {
        checksCompletedDate: new Date().toISOString().split('T')[0],
        nextServiceMaintenanceDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      signatures: {
        engineerSignature: true,
        engineerSerial: '',
        clientSignature: false,
        clientName: ''
      }
    }
  });

  const addAppliance = () => {
    appendAppliance({
      location: '',
      type: '',
      manufacturer: '',
      model: '',
      ownedByLandlord: '',
      applianceInspected: '',
      flueType: '',
      outcome: '',
      operatingPressure: '',
      safetyDevices: '',
      ventilation: '',
      flueCondition: '',
      flueOperation: '',
      combustionReading: '',
      wasServiced: '',
      safeToUse: '',
      visualOnly: '',
    });
  };

  const onSubmit = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF with demo.html styling
      await generateDemoPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDemoPDF = async () => {
    try {
      // Simply trigger the browser's print dialog which will use the existing print styles
      window.print();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const generateInvoice = async (invoiceData: InvoiceData) => {
    try {
      // Create invoice HTML and print
      const invoiceWindow = window.open('', '_blank');
      if (!invoiceWindow) {
        alert('Please allow popups to generate invoice');
        return;
      }

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 12px; color: #333; font-size: 12px; }
            .invoice-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; border-bottom: 2px solid #2e5aa6; padding-bottom: 10px; }
            .company-info { flex: 1; }
            .company-logo { width: 60px; height: 45px; object-fit: contain; margin-bottom: 5px; }
            .company-owner { font-size: 11px; color: #666; margin: 2px 0; }
            .invoice-title { text-align: right; }
            .invoice-title h1 { font-size: 28px; color: #2e5aa6; margin: 0; }
            .invoice-number { font-size: 14px; color: #666; margin: 2px 0; }
            .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
            .bill-to, .invoice-info { }
            .bill-to h3, .invoice-info h3 { color: #2e5aa6; border-bottom: 1px solid #2e5aa6; padding-bottom: 3px; margin-bottom: 8px; font-size: 13px; }
            .bill-to p, .invoice-info p { margin: 3px 0; font-size: 11px; line-height: 1.3; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
            .items-table th { background: #2e5aa6; color: white; padding: 6px 8px; text-align: left; font-size: 11px; }
            .items-table td { padding: 5px 8px; border-bottom: 1px solid #ddd; }
            .items-table tr:nth-child(even) { background: #f9f9f9; }
            .totals { margin-left: auto; width: 250px; }
            .totals table { width: 100%; font-size: 11px; }
            .totals td { padding: 4px 8px; }
            .totals .total-row { font-weight: bold; font-size: 14px; background: #2e5aa6; color: white; }
            .signature-section { margin-top: 20px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; }
            .signature-image { width: 100px; height: 30px; object-fit: contain; margin-bottom: 5px; }
            .signature-box p { font-size: 10px; margin: 2px 0; }
            .notes { margin-top: 15px; padding: 8px; background: #f5f7fa; border-left: 3px solid #2e5aa6; font-size: 10px; }
            .notes h4 { margin: 0 0 5px 0; font-size: 11px; }
            .notes p { margin: 0; line-height: 1.3; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="company-info">
              <img src="/logo.png" alt="Company Logo" class="company-logo" />
              <p class="company-owner">AKM ZAHURUL ISLAM</p>
            </div>
            <div class="invoice-title">
              <h1>INVOICE</h1>
              <p class="invoice-number">#${invoiceData.invoiceNumber}</p>
            </div>
          </div>

          <div class="invoice-details">
            <div class="bill-to">
              <h3>Bill To:</h3>
              <p><strong>${invoiceData.customerName}</strong></p>
              <p>${invoiceData.customerAddress}</p>
              ${invoiceData.customerPhone ? `<p>Phone: ${invoiceData.customerPhone}</p>` : ''}
              ${invoiceData.customerEmail ? `<p>Email: ${invoiceData.customerEmail}</p>` : ''}
            </div>
            <div class="invoice-info">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice Date:</strong> ${new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}</p>
              ${invoiceData.paymentTerms ? `<p><strong>Payment Terms:</strong> ${invoiceData.paymentTerms}</p>` : ''}
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="width: 80px;">Qty</th>
                <th style="width: 100px;">Rate</th>
                <th style="width: 100px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>£${item.rate.toFixed(2)}</td>
                  <td>£${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">£${invoiceData.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>VAT (${invoiceData.vatRate}%):</td>
                <td style="text-align: right;">£${invoiceData.vatAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td>Total:</td>
                <td style="text-align: right;">£${invoiceData.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <img src="/signature.png" alt="Signature" class="signature-image" />
              <p><strong>AKM ZAHURUL ISLAM</strong></p>
              <p>Authorized Signature</p>
            </div>
          </div>

          ${invoiceData.notes ? `
            <div class="notes">
              <h4>Notes:</h4>
              <p>${invoiceData.notes}</p>
            </div>
          ` : ''}
        </body>
        </html>
      `;

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

      // Wait for images to load then print
      setTimeout(() => {
        invoiceWindow.print();
      }, 1000);

    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice. Please try again.');
    }
  };

  const onInvoiceSubmit = async (data: InvoiceData) => {
    setIsGenerating(true);
    try {
      await generateInvoice(data);
      setShowInvoiceModal(false);
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateInvoiceTotals = () => {
    const items = invoiceForm.watch('items') || [];
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const vatRate = invoiceForm.watch('vatRate') || 0;
    const vatAmount = (subtotal * vatRate) / 100;
    const total = subtotal + vatAmount;

    invoiceForm.setValue('subtotal', subtotal);
    invoiceForm.setValue('vatAmount', vatAmount);
    invoiceForm.setValue('total', total);
  };








  const onChecklistSubmit = async (data: Record<string, unknown>) => {
    setIsGenerating(true);
    try {
      const checklistData = data as ChecklistData;

      // Create the checklist URL
      const checklistData64 = btoa(JSON.stringify(checklistData));
      const checklistUrl = `/checklist?data=${encodeURIComponent(checklistData64)}`;

      // Try to open in new tab
      const newWindow = window.open(checklistUrl, '_blank', 'noopener,noreferrer');

      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Popup was blocked, show a manual link
        const userConfirm = confirm(
          'Popup was blocked by your browser. Would you like to open the checklist in the same tab instead?'
        );

        if (userConfirm) {
          // Navigate in the same window
          window.location.href = checklistUrl;
        } else {
          // Show instructions to manually allow popups
          alert(
            'To open the checklist in a new tab:\n\n' +
            '1. Allow popups for this site in your browser\n' +
            '2. Or copy this URL and open it manually:\n' +
            window.location.origin + checklistUrl
          );
        }
      }

      setShowChecklistModal(false);
    } catch (error) {
      console.error('Error generating checklist:', error);
      alert('Error generating checklist. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Demo.html CSS Styles */}
      <style jsx global>{`
        @page { size: A4 landscape; margin: 6mm; }

        body {
          background: #f5f7fa !important;
          margin: 0;
          padding: 0;
          min-height: 100vh;
        }

        :root {
          --blue: #2e5aa6;
          --line: #2e5aa6;
          --cell: #ffffff;
          --head: #cdd9f3;
          --pale: #fff6b8;
        }

        .demo-form {
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
          background: #f5f7fa;
          min-height: 100vh;
          padding-bottom: 60px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .toolbar {
          position: sticky;
          top: 0;
          background: linear-gradient(135deg, #f7f9ff 0%, #eef3ff 100%);
          border-bottom: 2px solid #c8d1ef;
          padding: 16px 24px;
          display: flex;
          gap: 12px;
          justify-content: center;
          align-items: center;
          z-index: 50;
          box-shadow: 0 2px 8px rgba(46, 90, 166, 0.1);
        }

        .btn {
          appearance: none;
          border: 2px solid #b7c3e8;
          background: #fff;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 140px;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .btn.primary {
          background: linear-gradient(135deg, #2e5aa6 0%, #1e4a96 100%);
          color: #fff;
          border-color: #2e5aa6;
        }

        .btn.primary:hover {
          background: linear-gradient(135deg, #1e4a96 0%, #0e3a86 100%);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn:disabled:hover {
          transform: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .sheet {
          width: calc(297mm - 16mm);
          min-height: calc(210mm - 16mm);
          margin: 20px auto;
          box-sizing: border-box;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(46, 90, 166, 0.1);
          border: 1px solid #e1e8f0;
        }

        @media print {
          .sheet {
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0;
            box-shadow: none;
            border: none;
            font-size: 9px !important;
            transform: scale(0.85);
            transform-origin: top left;
            width: 118% !important;
          }

          .toolbar {
            display: none;
          }

          body {
            background: #fff !important;
          }

          .demo-form {
            background: #fff;
            padding-bottom: 0;
          }

          .company-logo,
          .signature-image {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Compress all elements */
          .titleband {
            margin-bottom: 2px !important;
            padding-bottom: 1px !important;
          }

          .titleband h1 {
            font-size: 14px !important;
            margin: 0 !important;
          }

          .company-logo {
            width: 50px !important;
            height: 38px !important;
          }

          .demo-table.hdr {
            font-size: 8px !important;
            margin-top: 2px !important;
          }

          .demo-table.hdr th,
          .demo-table.hdr td {
            padding: 1px 3px !important;
            font-size: 8px !important;
          }

          .row3 {
            gap: 2px !important;
            margin-top: 2px !important;
          }

          .block {
            border-width: 1px !important;
            margin-top: 2px !important;
          }

          .bar {
            font-size: 9px !important;
            padding: 1px 3px !important;
          }

          .block table {
            font-size: 7px !important;
          }

          .block table th,
          .block table td {
            padding: 1px 2px !important;
            font-size: 7px !important;
            line-height: 1 !important;
          }

          .signature-image {
            width: 80px !important;
            height: 20px !important;
          }

          /* Reduce all margins and padding */
          * {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }

          .demo-input {
            font-size: 7px !important;
            padding: 0px 1px !important;
          }
        }

        .titleband {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 10px;
          border-bottom: 3px solid var(--line);
          margin-bottom: 6px;
          padding-bottom: 3px;
        }

        .title-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .company-logo {
          object-fit: contain;
        }

        .titleband h1 {
          font-size: 18px;
          margin: 0;
        }

        .block {
          border: 2px solid var(--line);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 6px;
        }

        .bar {
          background: var(--blue);
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          padding: 4px 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .demo-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 12px;
        }

        .demo-table th,
        .demo-table td {
          border: 1px solid var(--line);
          padding: 4px 6px;
          background: var(--cell);
          vertical-align: middle;
        }

        .demo-table th {
          background: var(--head);
          text-align: left;
          font-weight: 700;
        }

        .ylw {
          background: var(--pale) !important;
        }

        .hdr {
          margin-top: 6px;
        }

        .row3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }

        .sigbox {
          height: 38px;
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 4px;
        }

        .signature-image {
          object-fit: contain;
          max-height: 30px;
        }

        .note {
          font-size: 10px;
          margin-top: 3px;
        }

        .tight td,
        .tight th {
          padding: 3px 4px;
        }

        .tiny td,
        .tiny th {
          padding: 2px 3px;
          font-size: 10.5px;
        }

        .wrap2 th {
          white-space: normal;
          line-height: 1.2;
        }

        .due {
          background: linear-gradient(180deg, #dbe6ff, #eef3ff);
          border: 2px solid var(--line);
          border-radius: 3px;
          text-align: center;
          padding: 10px 6px;
        }

        .due .big {
          font-size: 20px;
          font-weight: 800;
        }

        .demo-input {
          width: 100%;
          border: 0;
          background: transparent !important;
          font: inherit;
          color: #000;
          -webkit-text-fill-color: #000;
        }

        .demo-input:focus {
          outline: 2px solid #2e5aa6;
          outline-offset: -2px;
        }

        /* Prevent browser extension interference */
        .demo-input[data-lpignore="true"] {
          background: transparent !important;
        }

        /* Invoice Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #e1e8f0;
          background: linear-gradient(135deg, #2e5aa6 0%, #1e4080 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .invoice-form {
          padding: 32px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section h3 {
          color: #2e5aa6;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #2e5aa6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .form-input {
          border: 2px solid #e1e8f0;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #2e5aa6;
          box-shadow: 0 0 0 3px rgba(46, 90, 166, 0.1);
        }

        .invoice-item {
          background: #f8fafc;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .item-grid {
          display: grid;
          grid-template-columns: 2fr 80px 120px 120px auto;
          gap: 16px;
          align-items: end;
        }

        .btn-remove {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          height: fit-content;
          transition: background-color 0.2s;
        }

        .btn-remove:hover {
          background: #c82333;
        }

        .btn-add {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-add:hover {
          background: #218838;
        }

        .totals-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          align-items: start;
        }

        .totals-display {
          background: #f8fafc;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          padding: 20px;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 16px;
        }

        .total-line.total {
          border-top: 2px solid #2e5aa6;
          margin-top: 12px;
          padding-top: 16px;
          font-weight: bold;
          font-size: 18px;
          color: #2e5aa6;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 24px 32px;
          border-top: 1px solid #e1e8f0;
          background: #f8fafc;
          border-radius: 0 0 12px 12px;
        }

        .btn.secondary {
          background: #6c757d;
          color: white;
        }

        .btn.secondary:hover {
          background: #5a6268;
        }

        .date-field {
          border-bottom: 1px solid var(--line);
          padding-bottom: 2px;
          min-height: 18px;
        }

        .demo-textarea {
          height: 48px;
          resize: vertical;
          width: 100%;
          border: 0;
          background: transparent;
          font: inherit;
          color: #000;
        }

        .add-btn {
          appearance: none;
          border: 1px solid #b7c3e8;
          background: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Enhanced Checklist Modal Styles */
        .checklist-section {
          margin: 25px 0;
          padding: 25px;
          border: 2px solid #e1e8f0;
          border-radius: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 0 4px 15px rgba(46, 90, 166, 0.08);
          transition: all 0.3s ease;
        }

        .checklist-section:hover {
          border-color: #2e5aa6;
          box-shadow: 0 6px 20px rgba(46, 90, 166, 0.12);
          transform: translateY(-2px);
        }

        .checklist-section h3 {
          margin: 0 0 20px 0;
          color: white;
          font-size: 18px;
          font-weight: 700;
          padding: 12px 16px;
          background: linear-gradient(135deg, #2e5aa6 0%, #1e4080 100%);
          border-radius: 8px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          box-shadow: 0 3px 10px rgba(46, 90, 166, 0.3);
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin: 15px 0;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .checkbox-item:hover {
          background: rgba(46, 90, 166, 0.05);
        }

        .checkbox-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #2e5aa6;
        }

        .appliance-checklist {
          margin: 15px 0;
          padding: 15px;
          border: 1px solid #d1d9e6;
          border-radius: 6px;
          background: #ffffff;
        }

        .appliance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .appliance-header h4 {
          margin: 0;
          color: #2e5aa6;
          font-size: 14px;
          font-weight: 600;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .remove-btn:hover {
          background: #c82333;
        }

        .add-appliance-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 15px;
        }

        .add-appliance-btn:hover {
          background: #218838;
        }

        /* Enhanced Form Input Styling */
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #2e5aa6;
          box-shadow: 0 0 0 3px rgba(46, 90, 166, 0.1);
          transform: translateY(-1px);
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #2e5aa6;
          font-weight: 600;
          font-size: 14px;
        }

        /* Safety Checks Enhanced Styling */
        .safety-check-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 8px;
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .safety-check-item:hover {
          border-color: #2e5aa6;
          box-shadow: 0 3px 10px rgba(46, 90, 166, 0.1);
        }

        .safety-check-item strong {
          color: #1e293b;
          font-weight: 600;
          font-size: 13px;
        }

        .safety-check-item label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .safety-check-item label:hover {
          background: #f1f5f9;
        }

        .safety-check-item input[type="radio"] {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: #2e5aa6;
        }

        /* Submit Button Styling */
        .checklist-submit-container {
          margin-top: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #f8fafc 0%, #e1e8f0 100%);
          border-radius: 12px;
          border: 2px solid #2e5aa6;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .checklist-submit-btn {
          background: linear-gradient(135deg, #2e5aa6 0%, #1e4080 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(46, 90, 166, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          min-width: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .checklist-submit-btn:hover {
          background: linear-gradient(135deg, #1e4080 0%, #2e5aa6 100%);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(46, 90, 166, 0.4);
        }

        .checklist-submit-btn:active {
          transform: translateY(-1px);
        }

        .checklist-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Enhanced Modal Footer */
        .btn-secondary:hover {
          background: #6c757d !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }

        /* Loading Animation */
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Modal Backdrop Enhancement */
        .modal-overlay {
          backdrop-filter: blur(8px) !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            max-height: 95vh;
          }

          .modal-header {
            padding: 20px 25px;
          }

          .modal-body {
            padding: 25px;
          }

          .checklist-section {
            padding: 20px;
            margin: 20px 0;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .safety-check-item {
            grid-template-columns: 1fr;
            gap: 8px;
            text-align: left;
          }

          .safety-check-item label {
            justify-content: flex-start;
          }

          .checklist-submit-btn {
            min-width: 200px;
            font-size: 16px;
            padding: 14px 30px;
          }
        }

        @media print {
          .toolbar {
            display: none;
          }
          .add-btn {
            display: none !important;
          }
          input,
          textarea {
            -webkit-text-fill-color: #000 !important;
            color: #000 !important;
          }
        }
      `}</style>

      <div className="demo-form" suppressHydrationWarning={true}>
        <div className="toolbar" role="toolbar" aria-label="Actions">
          <button className="btn" type="button" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset Form
          </button>
          <button className="btn primary" type="button" onClick={handlePrint}>
            <Printer size={16} />
            Print / Save PDF
          </button>
          <button
            className="btn primary"
            type="button"
            onClick={() => setShowChecklistModal(true)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <CheckSquare size={16} />
                Generate Checklist
              </>
            )}
          </button>
          <button
            className="btn primary"
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Receipt size={16} />
                Generate Invoice
              </>
            )}
          </button>
        </div>

        <div className="sheet">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="titleband">
              <div className="title-content">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  width={80}
                  height={60}
                  className="company-logo"
                />
                <h1>Domestic Landlord / Homeowner Gas Safety Record</h1>
              </div>
            </div>

            {/* Header strip */}
            <table className="demo-table hdr">
              <colgroup>
                <col style={{ width: '12%' }} />
                <col style={{ width: '23%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '23%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '18%' }} />
              </colgroup>
              <tbody>
                <tr>
                  <th>Date:</th>
                  <td>
                    <input
                      {...register('date')}
                      className="demo-input date-field"
                      type="date"
                    />
                  </td>
                  <th>Ref:</th>
                  <td>
                    <input {...register('ref')} className="demo-input" type="text" />
                  </td>
                  <th>Serial no:</th>
                  <td>
                    <input {...register('serialNo')} className="demo-input" type="text" />
                  </td>
                </tr>
                <tr>
                  <th>Gas Safe Reg No:</th>
                  <td>
                    <input {...register('gasSafeRegNo')} className="demo-input" type="text" />
                  </td>
                  <th></th>
                  <td></td>
                  <th></th>
                  <td></td>
                </tr>
              </tbody>
            </table>

            {/* Top three blocks */}
            <div className="row3">
              <div className="block">
                <div className="bar">Details of Registered Business</div>
                <table className="demo-table">
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>
                        <input
                          {...register('businessName')}
                          className="demo-input"
                          type="text"
                          data-lpignore="true"
                          autoComplete="off"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>
                        <input {...register('businessAddress1')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('businessAddress2')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('businessAddress3')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Postcode:</th>
                      <td>
                        <input {...register('businessPostcode')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Contact Number:</th>
                      <td>
                        <input {...register('businessContact')} className="demo-input" type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="block">
                <div className="bar">Details of Landlord / Homeowner (or agent where appropriate)</div>
                <table className="demo-table">
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>
                        <input {...register('landlordName')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>
                        <input {...register('landlordAddress1')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('landlordAddress2')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('landlordAddress3')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('landlordAddress4')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Postcode:</th>
                      <td>
                        <input {...register('landlordPostcode')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Contact Number:</th>
                      <td>
                        <input {...register('landlordContact')} className="demo-input" type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="block">
                <div className="bar">Details of Site</div>
                <table className="demo-table">
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>
                        <input {...register('siteName')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>
                        <input {...register('siteAddress1')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('siteAddress2')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('siteAddress3')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th></th>
                      <td>
                        <input {...register('siteAddress4')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Postcode:</th>
                      <td>
                        <input {...register('sitePostcode')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Contact Number:</th>
                      <td>
                        <input {...register('siteContact')} className="demo-input" type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appliance Details */}
            <div className="block">
              <div className="bar">
                <span>Appliance Details</span>
                <button type="button" className="add-btn" onClick={addAppliance}>
                  + Add appliance
                </button>
              </div>
              <table className="demo-table tight">
                <colgroup>
                  <col style={{ width: '4%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '12%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Manufacturer</th>
                    <th>Model</th>
                    <th>Owned by Landlord</th>
                    <th>Appliance Inspected?</th>
                    <th>Flue Type</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {applianceFields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="row-idx">{index + 1}</td>
                      <td>
                        <input
                          {...register(`appliances.${index}.location`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`appliances.${index}.type`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`appliances.${index}.manufacturer`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`appliances.${index}.model`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`appliances.${index}.ownedByLandlord`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`appliances.${index}.applianceInspected`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`appliances.${index}.flueType`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                      <td className="ylw">
                        <input
                          {...register(`appliances.${index}.outcome`)}
                          className="demo-input"
                          type="text"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inspection Details & Final checks */}
            <div className="row3">
              <div className="block" style={{ gridColumn: 'span 2' }}>
                <div className="bar">Inspection Details</div>
                <table className="demo-table tight tiny wrap2">
                  <colgroup>
                    <col style={{ width: '4%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '9%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="ylw">Operating Pressure (mbars) or heat input (kW/h)</th>
                      <th>Safety devices<br />operating correctly?</th>
                      <th>Satisfactory<br />Ventilation?</th>
                      <th>Visual condition of<br />flue & termination</th>
                      <th>Flue operation<br />checks.</th>
                      <th>Combustion analyser<br />reading.</th>
                      <th>Was appliance<br />serviced?</th>
                      <th>Is appliance safe<br />to use?</th>
                      <th>Visual inspection<br />only?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applianceFields.map((field, index) => (
                      <tr key={field.id}>
                        <td>{index + 1}</td>
                        <td className="ylw">
                          <input
                            {...register(`appliances.${index}.operatingPressure`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.safetyDevices`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.ventilation`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.flueCondition`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.flueOperation`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.combustionReading`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.wasServiced`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.safeToUse`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                        <td>
                          <input
                            {...register(`appliances.${index}.visualOnly`)}
                            className="demo-input"
                            type="text"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block">
                <div className="bar">Final check results</div>
                <table className="demo-table tight">
                  <colgroup>
                    <col style={{ width: '74%' }} />
                    <col style={{ width: '26%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>Outcome of gas tightness test</th>
                      <td className="ylw">
                        <input {...register('gasTightnessTest')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Is the main protective equipotential bonding satisfactory?</th>
                      <td>
                        <input {...register('bondingSatisfactory')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Is the emergency control accessible?</th>
                      <td>
                        <input {...register('emergencyControlAccessible')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Satisfactory visual inspection of gas installation pipework?</th>
                      <td>
                        <input {...register('pipeworkInspection')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>CO alarm fitted and working?</th>
                      <td>
                        <input {...register('coAlarmFitted')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>Smoke/fire alarm fitted and working?</th>
                      <td>
                        <input {...register('smokeAlarmFitted')} className="demo-input" type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes + Combustion readings */}
            <div className="row3">
              <div className="block">
                <div className="bar">Notes</div>
                <table className="demo-table">
                  <tbody>
                    <tr>
                      <td>
                        <textarea {...register('notes')} className="demo-textarea"></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="block" style={{ gridColumn: 'span 2' }}>
                <div className="bar">Combustion Performance Readings</div>
                <table className="demo-table tight">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Low</th>
                      <th>High</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>CO</th>
                      <td>
                        <input {...register('coLow')} className="demo-input" type="text" />
                      </td>
                      <td>
                        <input {...register('coHigh')} className="demo-input" type="text" />
                      </td>
                    </tr>
                    <tr>
                      <th>CO² Ratio</th>
                      <td>
                        <input {...register('co2Low')} className="demo-input" type="text" />
                      </td>
                      <td>
                        <input {...register('co2High')} className="demo-input" type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Defects / Remedial / Label */}
            <div className="row3">
              <div className="block">
                <div className="bar">Defects Identified</div>
                <table className="demo-table">
                  <tbody>
                    <tr>
                      <td style={{ height: '48px' }}>
                        <textarea {...register('defectsIdentified')} className="demo-textarea"></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="block">
                <div className="bar">Remedial Work Details</div>
                <table className="demo-table">
                  <tbody>
                    <tr>
                      <td style={{ height: '48px' }}>
                        <textarea {...register('remedialWork')} className="demo-textarea"></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="block">
                <div className="bar">Label & Warning Notice</div>
                <table className="demo-table">
                  <tbody>
                    <tr>
                      <td style={{ height: '48px' }}>
                        <textarea {...register('labelWarning')} className="demo-textarea"></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Due + Signatures */}
            <div className="row3">
              <div className="due">
                <div>
                  <strong>Next Inspection Is Due Before:</strong>
                </div>
                <div className="big">
                  <input
                    {...register('nextInspectionDate')}
                    className="demo-input date-field"
                    type="date"
                    style={{ textAlign: 'center', border: 0, background: 'transparent', font: 'inherit' }}
                  />
                </div>
              </div>

              <div className="block" style={{ gridColumn: 'span 2' }}>
                <div className="bar">Record Issued By:</div>
                <table className="demo-table tight">
                  <colgroup>
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '26%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>Signature:</th>
                      <td colSpan={4}>
                        <div className="sigbox">
                          <Image
                            src="/signature.png"
                            alt="Engineer Signature"
                            width={120}
                            height={30}
                            className="signature-image"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Gas Engineer</th>
                      <td>
                        <input {...register('engineerName')} className="demo-input" type="text" />
                      </td>
                      <th>Gas Safe Licence</th>
                      <td>
                        <input {...register('engineerLicence')} className="demo-input" type="text" />
                      </td>
                      <th>Date</th>
                      <td>
                        <input
                          {...register('engineerDate')}
                          className="demo-input date-field"
                          type="date"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row3">
              <div className="block" style={{ gridColumn: 'span 3' }}>
                <div className="bar">Received By:</div>
                <table className="demo-table tight">
                  <colgroup>
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '26%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>Signature:</th>
                      <td colSpan={4}>
                        <div className="sigbox"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>
                        <input {...register('receivedByName')} className="demo-input" type="text" />
                      </td>
                      <th>Position</th>
                      <td>
                        <input {...register('receivedByPosition')} className="demo-input" type="text" />
                      </td>
                      <th>Date</th>
                      <td>
                        <input
                          {...register('receivedByDate')}
                          className="demo-input date-field"
                          type="date"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="note">
              This record can be used to document the outcome of checks and tests required by The Gas Safety (Installation and Use) Regulations 1998 as amended by the Gas Safety (Installation and Use) (Amendment) Regulations 2018. Some of the outcomes are as a result of visual inspection only and are recorded where appropriate. Unless specifically recorded no detailed inspection of the flue lining, construction or integrity has been performed. Registered Business / engineer details can be checked at www.gassaferegister.co.uk or by calling 0800 408 5500.
            </div>
          </form>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Generate Invoice</h2>
              <button
                className="modal-close"
                onClick={() => setShowInvoiceModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="invoice-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Invoice Number</label>
                  <input
                    {...invoiceForm.register('invoiceNumber')}
                    className="form-input"
                    type="text"
                  />
                </div>

                <div className="form-group">
                  <label>Invoice Date</label>
                  <input
                    {...invoiceForm.register('invoiceDate')}
                    className="form-input"
                    type="date"
                  />
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    {...invoiceForm.register('dueDate')}
                    className="form-input"
                    type="date"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Customer Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      {...invoiceForm.register('customerName')}
                      className="form-input"
                      type="text"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      {...invoiceForm.register('customerPhone')}
                      className="form-input"
                      type="tel"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Customer Address *</label>
                  <textarea
                    {...invoiceForm.register('customerAddress')}
                    className="form-input"
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    {...invoiceForm.register('customerEmail')}
                    className="form-input"
                    type="email"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Invoice Items</h3>
                {invoiceItems.map((item, index) => (
                  <div key={item.id} className="invoice-item">
                    <div className="item-grid">
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          {...invoiceForm.register(`items.${index}.description`)}
                          className="form-input"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Qty</label>
                        <input
                          {...invoiceForm.register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                            onChange: () => {
                              const qty = invoiceForm.getValues(`items.${index}.quantity`);
                              const rate = invoiceForm.getValues(`items.${index}.rate`);
                              invoiceForm.setValue(`items.${index}.amount`, qty * rate);
                              calculateInvoiceTotals();
                            }
                          })}
                          className="form-input"
                          type="number"
                          min="1"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Rate (£)</label>
                        <input
                          {...invoiceForm.register(`items.${index}.rate`, {
                            valueAsNumber: true,
                            onChange: () => {
                              const qty = invoiceForm.getValues(`items.${index}.quantity`);
                              const rate = invoiceForm.getValues(`items.${index}.rate`);
                              invoiceForm.setValue(`items.${index}.amount`, qty * rate);
                              calculateInvoiceTotals();
                            }
                          })}
                          className="form-input"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Amount (£)</label>
                        <input
                          {...invoiceForm.register(`items.${index}.amount`, { valueAsNumber: true })}
                          className="form-input"
                          type="number"
                          step="0.01"
                          readOnly
                        />
                      </div>

                      {invoiceItems.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => {
                            removeInvoiceItem(index);
                            calculateInvoiceTotals();
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-add"
                  onClick={() => appendInvoiceItem({ description: '', quantity: 1, rate: 0, amount: 0 })}
                >
                  + Add Item
                </button>
              </div>

              <div className="form-section">
                <h3>Totals</h3>
                <div className="totals-grid">
                  <div className="form-group">
                    <label>VAT Rate (%)</label>
                    <input
                      {...invoiceForm.register('vatRate', {
                        valueAsNumber: true,
                        onChange: calculateInvoiceTotals
                      })}
                      className="form-input"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="totals-display">
                    <div className="total-line">
                      <span>Subtotal: £{invoiceForm.watch('subtotal')?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="total-line">
                      <span>VAT: £{invoiceForm.watch('vatAmount')?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="total-line total">
                      <span>Total: £{invoiceForm.watch('total')?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Payment Terms</label>
                    <input
                      {...invoiceForm.register('paymentTerms')}
                      className="form-input"
                      type="text"
                      placeholder="e.g., 30 days"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    {...invoiceForm.register('notes')}
                    className="form-input"
                    rows={3}
                    placeholder="Thank you for your business!"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowInvoiceModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Receipt size={16} />
                      Generate Invoice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checklist Modal */}
      {showChecklistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Generate Gas Safety Checklist</h2>
              <button
                className="modal-close"
                onClick={() => setShowChecklistModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={checklistForm.handleSubmit(onChecklistSubmit)}>
              <div className="modal-body">

                {/* 1. Business Section */}
                <div className="checklist-section">
                  <h3>1. Business Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company Address *</label>
                      <textarea
                        {...checklistForm.register('business.companyAddress')}
                        rows={2}
                        placeholder="Enter company address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Postcode *</label>
                      <input
                        type="text"
                        {...checklistForm.register('business.postcode')}
                        placeholder="Enter postcode"
                      />
                    </div>
                    <div className="form-group">
                      <label>Telephone *</label>
                      <input
                        type="tel"
                        {...checklistForm.register('business.telephone')}
                        placeholder="Enter telephone number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile</label>
                      <input
                        type="tel"
                        {...checklistForm.register('business.mobile')}
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Gas Safe Engineer No *</label>
                      <input
                        type="text"
                        {...checklistForm.register('business.gasSafeEngineerNo')}
                        placeholder="Enter Gas Safe engineer number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Engineer Name *</label>
                      <input
                        type="text"
                        {...checklistForm.register('business.engineerName')}
                        placeholder="Enter engineer name"
                      />
                    </div>
                    <div className="form-group">
                      <label>License No *</label>
                      <input
                        type="text"
                        {...checklistForm.register('business.licenseNo')}
                        placeholder="Enter license number"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Site Details */}
                <div className="checklist-section">
                  <h3>2. Site Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Site Address *</label>
                      <textarea
                        {...checklistForm.register('siteDetails.siteAddress')}
                        rows={2}
                        placeholder="Enter site address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Postcode *</label>
                      <input
                        type="text"
                        {...checklistForm.register('siteDetails.postcode')}
                        placeholder="Enter site postcode"
                      />
                    </div>
                    <div className="form-group">
                      <label>Access Instructions</label>
                      <textarea
                        {...checklistForm.register('siteDetails.accessInstructions')}
                        rows={2}
                        placeholder="Enter access instructions"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Client Details */}
                <div className="checklist-section">
                  <h3>3. Client Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Client Name *</label>
                      <input
                        type="text"
                        {...checklistForm.register('clientDetails.clientName')}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Number *</label>
                      <input
                        type="tel"
                        {...checklistForm.register('clientDetails.contactNumber')}
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        {...checklistForm.register('clientDetails.email')}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Installation Details */}
                <div className="checklist-section">
                  <h3>4. Installation Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Installation Type *</label>
                      <input
                        type="text"
                        {...checklistForm.register('installationDetails.installationType')}
                        placeholder="e.g., Boiler Installation, Service"
                      />
                    </div>
                    <div className="form-group">
                      <label>Installation Date</label>
                      <input
                        type="date"
                        {...checklistForm.register('installationDetails.installationDate')}
                      />
                    </div>
                    <div className="form-group">
                      <label>Manufacturer</label>
                      <input
                        type="text"
                        {...checklistForm.register('installationDetails.manufacturer')}
                        placeholder="Enter manufacturer"
                      />
                    </div>
                    <div className="form-group">
                      <label>Model</label>
                      <input
                        type="text"
                        {...checklistForm.register('installationDetails.model')}
                        placeholder="Enter model"
                      />
                    </div>
                    <div className="form-group">
                      <label>Serial Number</label>
                      <input
                        type="text"
                        {...checklistForm.register('installationDetails.serialNumber')}
                        placeholder="Enter serial number"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Appliance Details */}
                <div className="checklist-section">
                  <h3>5. Appliance Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Appliance Type *</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.applianceType')}
                        placeholder="e.g., Boiler, Cooker, Fire"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location *</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.location')}
                        placeholder="e.g., Kitchen, Living Room"
                      />
                    </div>
                    <div className="form-group">
                      <label>Manufacturer</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.manufacturer')}
                        placeholder="Enter manufacturer"
                      />
                    </div>
                    <div className="form-group">
                      <label>Model</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.model')}
                        placeholder="Enter model"
                      />
                    </div>
                    <div className="form-group">
                      <label>Serial Number</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.serialNumber')}
                        placeholder="Enter serial number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Gas Type</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.gasType')}
                        placeholder="e.g., Natural Gas, LPG"
                      />
                    </div>
                    <div className="form-group">
                      <label>Input Rating</label>
                      <input
                        type="text"
                        {...checklistForm.register('applianceDetails.inputRating')}
                        placeholder="e.g., 24kW"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Safety Checks */}
                <div className="checklist-section">
                  <h3>6. Safety Checks (Pass/Fail/N/A)</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>

                    <div className="safety-check-item">
                      <strong>APPLIANCE Gas Connection and Isolation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.gasConnectionIsolation')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.gasConnectionIsolation')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.gasConnectionIsolation')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Electrical Connection & Isolation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.electricalConnectionIsolation')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.electricalConnectionIsolation')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.electricalConnectionIsolation')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Water Connection & Isolation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.waterConnectionIsolation')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.waterConnectionIsolation')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.waterConnectionIsolation')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Overall Condition, Stability and Controls Operation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.overallConditionStability')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.overallConditionStability')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.overallConditionStability')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Controls Operation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.controlsOperation')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.controlsOperation')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.controlsOperation')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Visual Inspection of Heat Exchanger</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.visualInspectionHeatExchanger')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.visualInspectionHeatExchanger')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.visualInspectionHeatExchanger')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Burner and Injectors</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.burnerAndInjectors')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.burnerAndInjectors')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.burnerAndInjectors')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Fans</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.fans')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.fans')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.fans')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Ignition</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.ignition')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.ignition')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.ignition')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Flame Picture</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.flamePicture')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.flamePicture')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.flamePicture')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Correct Safety Device(s) Operation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.correctSafetyDevicesOperation')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.correctSafetyDevicesOperation')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.correctSafetyDevicesOperation')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Heat Input/Operating Pressure</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.heatInputOperatingPressure')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.heatInputOperatingPressure')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.heatInputOperatingPressure')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Seals including Appliance Casing</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.sealsIncludingApplianceCasing')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.sealsIncludingApplianceCasing')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.sealsIncludingApplianceCasing')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Condensate Trap/Disposal</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.condensateTrapDisposal')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.condensateTrapDisposal')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.condensateTrapDisposal')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Pressure/Temperature Relief Valve</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.pressureTemperatureReliefValve')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.pressureTemperatureReliefValve')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.pressureTemperatureReliefValve')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Return Air/Plenum</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.returnAirPlenum')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.returnAirPlenum')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.returnAirPlenum')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Fireplace Catchment Space and Closure Plate</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.fireplaceCatchmentSpaceClosurePlate')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.fireplaceCatchmentSpaceClosurePlate')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.fireplaceCatchmentSpaceClosurePlate')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Flue Flow & Spillage Test</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.flueFlowSpillageTest')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.flueFlowSpillageTest')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.flueFlowSpillageTest')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Satisfactory Chimney/Flue</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.satisfactoryChimneyFlue')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.satisfactoryChimneyFlue')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.satisfactoryChimneyFlue')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Satisfactory Ventilation</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.satisfactoryVentilation')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.satisfactoryVentilation')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.satisfactoryVentilation')} value="NA" /> N/A</label>
                    </div>

                    <div className="safety-check-item">
                      <strong>Final Combustion Analyser Reading</strong>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.finalCombustionAnalyserReading')} value="PASS" /> Pass</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.finalCombustionAnalyserReading')} value="FAIL" /> Fail</label>
                      <label><input type="radio" {...checklistForm.register('safetyChecks.finalCombustionAnalyserReading')} value="NA" /> N/A</label>
                    </div>

                  </div>
                </div>

                {/* 7. Summary and Notes */}
                <div className="checklist-section">
                  <h3>7. Summary and Notes</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Work Carried Out</label>
                      <textarea
                        {...checklistForm.register('summaryNotes.workCarriedOut')}
                        rows={3}
                        placeholder="Describe work carried out"
                      />
                    </div>
                    <div className="form-group">
                      <label>Defects Found</label>
                      <textarea
                        {...checklistForm.register('summaryNotes.defectsFound')}
                        rows={3}
                        placeholder="List any defects found"
                      />
                    </div>
                    <div className="form-group">
                      <label>Recommended Actions</label>
                      <textarea
                        {...checklistForm.register('summaryNotes.recommendedActions')}
                        rows={3}
                        placeholder="Recommended actions"
                      />
                    </div>
                    <div className="form-group">
                      <label>Additional Notes</label>
                      <textarea
                        {...checklistForm.register('summaryNotes.additionalNotes')}
                        rows={3}
                        placeholder="Any additional notes"
                      />
                    </div>
                  </div>
                </div>

                {/* 8. Date Section */}
                <div className="checklist-section">
                  <h3>8. Date Section</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Checks Completed Date *</label>
                      <input
                        type="date"
                        {...checklistForm.register('dateSection.checksCompletedDate')}
                      />
                    </div>
                    <div className="form-group">
                      <label>Next Service/Maintenance Date</label>
                      <input
                        type="date"
                        {...checklistForm.register('dateSection.nextServiceMaintenanceDate')}
                      />
                    </div>
                  </div>
                </div>

                {/* 9. Signatures */}
                <div className="checklist-section">
                  <h3>9. Signatures</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Engineer Serial *</label>
                      <input
                        type="text"
                        {...checklistForm.register('signatures.engineerSerial')}
                        placeholder="Enter engineer serial number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Client Name</label>
                      <input
                        type="text"
                        {...checklistForm.register('signatures.clientName')}
                        placeholder="Enter client name for signature"
                      />
                    </div>
                  </div>
                </div>




              </div>

              <div className="checklist-submit-container">
                <button
                  type="button"
                  onClick={() => setShowChecklistModal(false)}
                  className="btn-secondary"
                  style={{
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    border: '2px solid #6c757d',
                    background: 'white',
                    color: '#6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="checklist-submit-btn"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <CheckSquare size={16} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
