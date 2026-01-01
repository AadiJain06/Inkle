import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import { fetchTaxes, fetchCountries } from './services/api';
import type { TaxRecord, Country } from './types';
import './App.css';

function App() {
  const [taxes, setTaxes] = useState<TaxRecord[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [taxesData, countriesData] = await Promise.all([
          fetchTaxes(),
          fetchCountries(),
        ]);
        setTaxes(taxesData);
        setCountries(countriesData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDataUpdate = (updatedRecord: TaxRecord) => {
    setTaxes((prevTaxes) =>
      prevTaxes.map((tax) => (tax.id === updatedRecord.id ? updatedRecord : tax))
    );
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Inkle Assignment</h1>
        <DataTable data={taxes} countries={countries} onDataUpdate={handleDataUpdate} />
      </div>
    </div>
  );
}

export default App;

