const FilterBar = ({ activeFilter, onFilter }) => {
    const filters = [
      ['all', 'All'],
      ['recent', 'Recent'],
      ['celebration', 'Celebration'],
      ['thank-you', 'Thank You'],
      ['inspiration', 'Inspiration']
    ]
  
    return (
      <div className="filter-bar">
        {filters.map(([value, label]) => (
          <button
            key={value}
            className={activeFilter === value ? 'active' : ''}
            onClick={() => onFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
    )
  }
  
  export default FilterBar