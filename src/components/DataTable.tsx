import { useMemo, useState, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { TaxRecord, Country } from '../types';
import EditModal from './EditModal';
import './DataTable.css';

interface DataTableProps {
  data: TaxRecord[];
  countries: Country[];
  onDataUpdate?: (updatedRecord: TaxRecord) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, countries, onDataUpdate }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isCountryFilterOpen, setIsCountryFilterOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TaxRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      // Handle various date formats
      let date: Date;
      
      // Check if it's already in a readable format (e.g., "Jun 16, 2025")
      if (dateString.match(/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/)) {
        return dateString;
      }
      
      // Try parsing as ISO date
      date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getGenderColor = (gender: string): string => {
    const normalized = gender.toLowerCase();
    if (normalized === 'male') return '#ec4899'; // Pink for Male
    if (normalized === 'female') return '#93c5fd'; // Light blue for Female
    return '#9ca3af';
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsCountryFilterOpen(false);
      }
    };

    if (isCountryFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryFilterOpen]);

  const columns = useMemo<ColumnDef<TaxRecord>[]>(
    () => [
      {
        accessorKey: 'entity',
        header: 'Entity',
        cell: (info) => info.getValue() as string,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: (info) => {
          const gender = (info.getValue() as string) || '';
          const color = getGenderColor(gender);
          return (
            <span className="gender-badge" style={{ backgroundColor: color }}>
              {gender}
            </span>
          );
        },
      },
      {
        accessorKey: 'requestDate',
        header: 'Request date',
        cell: (info) => formatDate(info.getValue() as string),
      },
      {
        accessorKey: 'country',
        header: () => (
          <div className="country-header" ref={filterRef}>
            <span>Country</span>
            <button
              className="filter-icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsCountryFilterOpen(!isCountryFilterOpen);
              }}
              aria-label="Filter countries"
            >
              <span className={`filter-arrow ${isCountryFilterOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isCountryFilterOpen && (
              <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                {countries.map((country) => (
                  <label key={country.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCountries([...selectedCountries, country.name]);
                        } else {
                          setSelectedCountries(selectedCountries.filter((c) => c !== country.name));
                        }
                      }}
                    />
                    <span>{country.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ),
        cell: (info) => info.getValue() as string,
      },
      {
        id: 'actions',
        header: '',
        cell: (info) => (
          <button
            className="edit-button"
            onClick={() => {
              setEditingRecord(info.row.original);
              setIsModalOpen(true);
            }}
            aria-label="Edit"
          >
            ✎
          </button>
        ),
      },
    ],
    [selectedCountries, isCountryFilterOpen, countries]
  );

  const filteredData = useMemo(() => {
    if (selectedCountries.length === 0) return data;
    return data.filter((record) => selectedCountries.includes(record.country));
  }, [data, selectedCountries]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleSave = (updatedRecord: TaxRecord) => {
    if (onDataUpdate) {
      onDataUpdate(updatedRecord);
    }
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="table-header">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="table-row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRecord && (
        <EditModal
          record={editingRecord}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DataTable;

