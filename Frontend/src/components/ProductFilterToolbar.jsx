import React from 'react';
import { Grid, List } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

const ProductFilterToolbar = ({
  totalCount = 0,
  entityName = 'item',
  entityNamePlural,
  sortOptions = [],
  sortValue,
  onChangeSort,
  viewMode,
  onChangeViewMode,
  disableListView = false,
  disableGridView = false,
  className = '',
  sortPlaceholder = 'Sort by',
  dropdownProps = {},
}) => {
  const baseName = entityName || 'item';
  const pluralName =
    entityNamePlural ||
    (baseName && baseName.endsWith('s') ? baseName : `${baseName}s`);
  const displayName = totalCount === 1 ? baseName : pluralName;
  const availabilityText =
    totalCount > 0
      ? `${totalCount} ${displayName} available`
      : `No ${pluralName} found`;

  return (
    <section className={`py-4 md:py-8 bg-white ${className}`}>
      <div className="max-w-[1580px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-montserrat-medium-500 text-black-light">
              {availabilityText}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <CustomDropdown
              options={sortOptions}
              value={sortValue}
              onChange={onChangeSort}
              placeholder={sortPlaceholder}
              className="min-w-[200px]"
              searchable={false}
              {...dropdownProps}
            />

            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              {!disableGridView && (
                <button
                  onClick={() => onChangeViewMode?.('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
              )}
              {!disableListView && (
                <button
                  onClick={() => onChangeViewMode?.('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFilterToolbar;


