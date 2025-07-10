interface ViewModeToggleProps {
  viewMode: 'cards' | 'table'
  onViewModeChange: (mode: 'cards' | 'table') => void
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="btn-group w-100" role="group">
      <button
        type="button"
        className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onViewModeChange('cards')}
      >
        <i className="bi bi-grid-3x3-gap"></i>
      </button>
      <button
        type="button"
        className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onViewModeChange('table')}
      >
        <i className="bi bi-table"></i>
      </button>
    </div>
  )
}

export default ViewModeToggle
