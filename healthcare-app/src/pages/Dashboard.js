import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';

const SEARCH_PATIENTS = gql`
  query SearchPatients(
    $symptoms: String!
    $diagnosis: String!
    $lab_results: [String!]
    $age_range: String!
    $gender: String!
  ) {
    patient_records(where: {
      _and: [
        { symptoms: { _ilike: $symptoms } }
        { diagnosis: { _ilike: $diagnosis } }
        { age_range: { _eq: $age_range } }
        { gender: { _eq: $gender } }
        { lab_results: { _contains: $lab_results } }
      ]
    }) {
      id
      patient_name
      patient_age
      gender
      contact_number
      email
      address
      symptoms
      diagnosis
      lab_results
      age_range
      created_at
    }
  }
`;

const Dashboard = () => {
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    labResults: ['Normal'],
    ageRange: '',
    gender: ''
  });

  const [searchPatients, { loading, error, data }] = useLazyQuery(SEARCH_PATIENTS, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Search error:', error);
    }
  });

  const handleLabResultChange = (value) => {
    setFormData(prev => ({
      ...prev,
      labResults: prev.labResults.includes(value)
        ? prev.labResults.filter(item => item !== value)
        : [...prev.labResults, value]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchPatients({
      variables: {
        symptoms: formData.symptoms || '%',
        diagnosis: formData.diagnosis || '%',
        lab_results: formData.labResults,
        age_range: formData.ageRange || '%',
        gender: formData.gender || '%'
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1f36] text-[#7fdbda] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome, User</h1>
        <h2 className="text-2xl mb-8 text-center">Healthcare Data Search</h2>

        <div className="bg-[#242b45] rounded-lg p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-[#7fdbda] mb-2">Symptoms:</label>
              <select
                className="w-full p-2 rounded bg-[#1a1f36] text-white border border-[#374151]"
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
              >
                <option value="">Select Symptom</option>
                <option value="Fever">Fever</option>
                <option value="Headache">Headache</option>
                <option value="Cough">Cough</option>
                <option value="Shortness of Breath">Shortness of Breath</option>
                <option value="Chest Pain">Chest Pain</option>
                <option value="Fatigue">Fatigue</option>
                <option value="Abdominal Pain">Abdominal Pain</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7fdbda] mb-2">Diagnosis:</label>
              <select
                className="w-full p-2 rounded bg-[#1a1f36] text-white border border-[#374151]"
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              >
                <option value="">Select Diagnosis</option>
                <option value="Migraine">Migraine</option>
                <option value="Flu">Flu</option>
                <option value="Covid">Covid</option>
                <option value="Bronchitis">Bronchitis</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Asthma">Asthma</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7fdbda] mb-2">Lab Results:</label>
              <div className="space-x-4">
                {['Normal', 'Elevated WBC', 'Elevated Cholesterol', 'Low Hemoglobin'].map((result) => (
                  <label key={result} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-[#7fdbda]"
                      checked={formData.labResults.includes(result)}
                      onChange={() => handleLabResultChange(result)}
                    />
                    <span className="ml-2">{result}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#7fdbda] mb-2">Age Range:</label>
              <select
                className="w-full p-2 rounded bg-[#1a1f36] text-white border border-[#374151]"
                value={formData.ageRange}
                onChange={(e) => setFormData(prev => ({ ...prev, ageRange: e.target.value }))}
              >
                <option value="">Select Age Range</option>
                <option value="18-35">18-35</option>
                <option value="36-50">36-50</option>
                <option value="51-65">51-65</option>
              </select>
            </div>

            <div>
              <label className="block text-[#7fdbda] mb-2">Gender:</label>
              <select
                className="w-full p-2 rounded bg-[#1a1f36] text-white border border-[#374151]"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#7fdbda] text-[#1a1f36] rounded hover:bg-opacity-90"
            >
              Search Patient Records
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-[#7fdbda]">Search Results</h3>
          {loading && <p className="text-[#7fdbda]">Loading...</p>}
          {error && (
            <p className="text-red-500">An error occurred. Please try again.</p>
          )}
          {data?.patient_records && (
            <div className="space-y-4">
              {data.patient_records.map((patient) => (
                <div key={patient.id} className="bg-[#242b45] p-6 rounded-lg shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 border-b border-[#7fdbda] pb-2 mb-4">
                      <h4 className="text-xl font-semibold text-[#7fdbda]">
                        {patient.patient_name}
                      </h4>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Age:</span> {patient.patient_age} years
                      </p>
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Gender:</span> {patient.gender}
                      </p>
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Contact:</span> {patient.contact_number}
                      </p>
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Email:</span> {patient.email}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Symptoms:</span> {patient.symptoms}
                      </p>
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Diagnosis:</span> {patient.diagnosis}
                      </p>
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Lab Results:</span> {patient.lab_results.join(', ')}
                      </p>
                      <p className="text-[#7fdbda]">
                        <span className="font-semibold">Address:</span> {patient.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-2 border-t border-[#7fdbda]">
                    <p className="text-sm text-[#7fdbda] opacity-75">
                      Patient ID: {patient.id} | Last Updated: {new Date(patient.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {data?.patient_records?.length === 0 && (
            <p className="text-[#7fdbda]">No matching records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
