'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, Plus, Trash2, Loader2 } from 'lucide-react';
import { generatePDF } from '@/utils/pdfGenerator';

// Form validation schema
const gasSafetySchema = z.object({
  // Property Details
  propertyAddress: z.string().min(1, 'Property address is required'),
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress: z.string().min(1, 'Landlord address is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  
  // Engineer Details
  engineerName: z.string().min(1, 'Engineer name is required'),
  engineerRegistration: z.string().min(1, 'Gas Safe registration number is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  
  // Inspection Details
  inspectionDate: z.string().min(1, 'Inspection date is required'),
  nextInspectionDate: z.string().min(1, 'Next inspection date is required'),
  
  // Appliances
  appliances: z.array(z.object({
    type: z.string().min(1, 'Appliance type is required'),
    location: z.string().min(1, 'Location is required'),
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    flueType: z.string().min(1, 'Flue type is required'),
    safetyCheck: z.enum(['Pass', 'Fail', 'Not Applicable']),
    remedialAction: z.string().optional(),
  })).min(1, 'At least one appliance is required'),
  
  // Additional checks
  gasSupplyPipework: z.enum(['Pass', 'Fail', 'Not Applicable']),
  gasMetering: z.enum(['Pass', 'Fail', 'Not Applicable']),
  emergencyControls: z.enum(['Pass', 'Fail', 'Not Applicable']),
  ventilation: z.enum(['Pass', 'Fail', 'Not Applicable']),
  
  // Overall assessment
  overallAssessment: z.enum(['Satisfactory', 'Unsatisfactory']),
  additionalComments: z.string().optional(),
});

type GasSafetyFormData = z.infer<typeof gasSafetySchema>;

export function GasSafetyForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GasSafetyFormData>({
    resolver: zodResolver(gasSafetySchema),
    defaultValues: {
      appliances: [
        {
          type: '',
          location: '',
          make: '',
          model: '',
          flueType: '',
          safetyCheck: 'Pass',
          remedialAction: '',
        },
      ],
      gasSupplyPipework: 'Pass',
      gasMetering: 'Pass',
      emergencyControls: 'Pass',
      ventilation: 'Pass',
      overallAssessment: 'Satisfactory',
    },
  });

  const appliances = watch('appliances');

  const addAppliance = () => {
    setValue('appliances', [
      ...appliances,
      {
        type: '',
        location: '',
        make: '',
        model: '',
        flueType: '',
        safetyCheck: 'Pass',
        remedialAction: '',
      },
    ]);
  };

  const removeAppliance = (index: number) => {
    if (appliances.length > 1) {
      setValue('appliances', appliances.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: GasSafetyFormData) => {
    setIsGenerating(true);
    try {
      await generatePDF(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300">
      {/* Header */}
      <div className="bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          LANDLORD GAS SAFETY RECORD
        </h1>
        <p className="text-sm text-gray-600">
          Gas Safety (Installation and Use) Regulations 1998 - Regulation 36(3)(a) and (b)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Property Details Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            1. PREMISES TO WHICH THIS RECORD RELATES
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Address *
            </label>
            <textarea
              {...register('propertyAddress')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter full property address"
            />
            {errors.propertyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyAddress.message}</p>
            )}
          </div>
        </div>

        {/* Landlord Details Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            2. LANDLORD OR AGENT DETAILS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landlord Name *
              </label>
              <input
                {...register('landlordName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter landlord name"
              />
              {errors.landlordName && (
                <p className="text-red-500 text-sm mt-1">{errors.landlordName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landlord Address *
              </label>
              <textarea
                {...register('landlordAddress')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter landlord address"
              />
              {errors.landlordAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.landlordAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tenant Details Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            3. TENANT DETAILS
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tenant Name *
            </label>
            <input
              {...register('tenantName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tenant name"
            />
            {errors.tenantName && (
              <p className="text-red-500 text-sm mt-1">{errors.tenantName.message}</p>
            )}
          </div>
        </div>

        {/* Engineer Details Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            4. ENGINEER DETAILS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engineer Name *
              </label>
              <input
                {...register('engineerName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter engineer name"
              />
              {errors.engineerName && (
                <p className="text-red-500 text-sm mt-1">{errors.engineerName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gas Safe Registration Number *
              </label>
              <input
                {...register('engineerRegistration')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Gas Safe registration number"
              />
              {errors.engineerRegistration && (
                <p className="text-red-500 text-sm mt-1">{errors.engineerRegistration.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                {...register('companyName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Address *
              </label>
              <textarea
                {...register('companyAddress')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter company address"
              />
              {errors.companyAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Inspection Details Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            5. INSPECTION DETAILS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Date *
              </label>
              <input
                type="date"
                {...register('inspectionDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.inspectionDate && (
                <p className="text-red-500 text-sm mt-1">{errors.inspectionDate.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Inspection Date *
              </label>
              <input
                type="date"
                {...register('nextInspectionDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.nextInspectionDate && (
                <p className="text-red-500 text-sm mt-1">{errors.nextInspectionDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Appliances Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 bg-gray-100 p-2 rounded flex-1 mr-4">
              6. GAS APPLIANCES, FLUES AND PIPEWORK CHECKED
            </h2>
            <button
              type="button"
              onClick={addAppliance}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Appliance
            </button>
          </div>

          {appliances.map((appliance, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Appliance {index + 1}
                </h3>
                {appliances.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAppliance(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appliance Type *
                  </label>
                  <select
                    {...register(`appliances.${index}.type`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="Boiler">Boiler</option>
                    <option value="Fire">Fire</option>
                    <option value="Cooker">Cooker</option>
                    <option value="Hob">Hob</option>
                    <option value="Water Heater">Water Heater</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.appliances?.[index]?.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.appliances[index]?.type?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    {...register(`appliances.${index}.location`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Kitchen, Living Room"
                  />
                  {errors.appliances?.[index]?.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.appliances[index]?.location?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    {...register(`appliances.${index}.make`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Manufacturer"
                  />
                  {errors.appliances?.[index]?.make && (
                    <p className="text-red-500 text-sm mt-1">{errors.appliances[index]?.make?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    {...register(`appliances.${index}.model`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Model number"
                  />
                  {errors.appliances?.[index]?.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.appliances[index]?.model?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flue Type *
                  </label>
                  <select
                    {...register(`appliances.${index}.flueType`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select flue type</option>
                    <option value="Open Flue">Open Flue</option>
                    <option value="Room Sealed">Room Sealed</option>
                    <option value="Flueless">Flueless</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                  {errors.appliances?.[index]?.flueType && (
                    <p className="text-red-500 text-sm mt-1">{errors.appliances[index]?.flueType?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Safety Check *
                  </label>
                  <select
                    {...register(`appliances.${index}.safetyCheck`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remedial Action Required (if applicable)
                </label>
                <textarea
                  {...register(`appliances.${index}.remedialAction`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe any remedial action required"
                />
              </div>
            </div>
          ))}

          {errors.appliances && (
            <p className="text-red-500 text-sm mt-1">{errors.appliances.message}</p>
          )}
        </div>

        {/* Safety Checks Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            7. SAFETY CHECKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gas Supply Pipework *
              </label>
              <select
                {...register('gasSupplyPipework')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gas Metering *
              </label>
              <select
                {...register('gasMetering')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Controls *
              </label>
              <select
                {...register('emergencyControls')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ventilation *
              </label>
              <select
                {...register('ventilation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Assessment Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            8. OVERALL ASSESSMENT
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Assessment *
              </label>
              <select
                {...register('overallAssessment')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Satisfactory">Satisfactory</option>
                <option value="Unsatisfactory">Unsatisfactory</option>
              </select>
              {errors.overallAssessment && (
                <p className="text-red-500 text-sm mt-1">{errors.overallAssessment.message}</p>
              )}
            </div>

          </div>
        </div>

        {/* Additional Comments Section */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-2 rounded">
            9. ADDITIONAL COMMENTS
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              {...register('additionalComments')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Any additional comments or observations"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium flex items-center"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generating PDF...' : 'Generate PDF Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
}
