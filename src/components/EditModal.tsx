import React, { useState, useEffect, useRef } from 'react';
import type { TaxRecord, Country } from '../types';
import { fetchCountries, updateTaxRecord } from '../services/api';
import './EditModal.css';

interface EditModalProps {
  record: TaxRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: TaxRecord) => void;
}

const EditModal: React.FC<EditModalProps> = ({ record, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(record.name);
  const [selectedCountry, setSelectedCountry] = useState(record.country);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(record.name);
      setSelectedCountry(record.country);
      loadCountries();
    }
  }, [isOpen, record]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (err) {
      setError('Failed to load countries');
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedData = {
        ...record,
        name: name.trim(),
        country: selectedCountry,
      };

      const updatedRecord = await updateTaxRecord(record.id, updatedData);
      onSave(updatedRecord);
      onClose();
    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setIsCountryDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Customer</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-field">
            <label htmlFor="name" className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <div className="dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className="dropdown-button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              >
                <span>{selectedCountry || 'Select country'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {isCountryDropdownOpen && (
                <div className="dropdown-menu">
                  {countries.map((country) => (
                    <div
                      key={country.id}
                      className="dropdown-item"
                      onClick={() => handleCountrySelect(country.name)}
                    >
                      <span className="dropdown-item-icon"></span>
                      <span className="dropdown-item-text">{country.name}</span>
                      <span className="dropdown-item-edit">✎</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

