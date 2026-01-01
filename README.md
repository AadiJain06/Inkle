# Inkle Assignment - Frontend Intern

A React + TypeScript application built with Vite that displays tax records in a data table with filtering and editing capabilities.

## Features

- **Data Table**: Built with @tanstack/react-table displaying Entity, Gender, Request date, and Country columns
- **Country Filter**: Dropdown filter with checkboxes to filter records by country
- **Edit Modal**: Edit customer name and country with validation
- **API Integration**: Fetches data from mock APIs and updates records via PUT requests
- **Responsive Design**: Clean, modern UI matching the Figma design

## Tech Stack

- React 18
- TypeScript
- Vite
- @tanstack/react-table v8
- CSS3

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── DataTable.tsx      # Main table component with filtering
│   ├── DataTable.css      # Table styles
│   ├── EditModal.tsx      # Edit customer modal
│   └── EditModal.css      # Modal styles
├── services/
│   └── api.ts             # API service functions
├── types.ts               # TypeScript type definitions
├── App.tsx                 # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## API Endpoints

- **GET** `https://685013d7e7c42cfd17974a33.mockapi.io/taxes` - Fetch tax records
- **GET** `https://685013d7e7c42cfd17974a33.mockapi.io/countries` - Fetch countries list
- **PUT** `https://685013d7e7c42cfd17974a33.mockapi.io/taxes/:id` - Update tax record

## Usage

1. **View Records**: The table displays all tax records with Entity, Gender, Request date, and Country columns
2. **Filter by Country**: Click the filter icon (▼) next to the Country header to filter records
3. **Edit Record**: Click the edit icon (✎) on any row to open the edit modal
4. **Update Data**: Modify the name and/or country, then click Save to update the record

## Features Implemented

✅ Table built with @tanstack/react-table  
✅ Entity, Gender, Request date, Country columns  
✅ Country filter dropdown with checkboxes  
✅ Edit modal with Name and Country fields  
✅ Country dropdown populated from API  
✅ PUT API call on save with existing data + updated fields  
✅ Pixel-perfect UI matching design  
✅ Good UX with loading states and error handling  

