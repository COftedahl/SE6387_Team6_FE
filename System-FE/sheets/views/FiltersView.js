import FilterMenu from '../../components/FilterMenu';

export default function FiltersView({ onBack, filters, onFiltersChange }) {
  return (
    <FilterMenu
      onBack={onBack}
      filters={filters}
      onFiltersChange={onFiltersChange}
    />
  );
}