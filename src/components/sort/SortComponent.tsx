import AssetsConstant from "../../consts/AssetsConstant";

interface SortComponentProps {
    onSortDecrease: () => void;
    onSortIncrease: () => void;
    currentSort: 'decrease' | 'increase' | null;
  }
  
  const SortComponent = ({ onSortDecrease, onSortIncrease, currentSort }: SortComponentProps) => {
    return (
      <div className="filter-wrapper">
        <span className="filter-title">Sắp Xếp theo:</span>
        <div className="filter">
          <button 
            className={`filter-option ${currentSort === 'decrease' ? 'active' : ''}`}
            onClick={onSortDecrease}
          >
            <img src={AssetsConstant.DECREASE_ICON} alt="decrease icon" />
            Giảm dần
          </button>
          <button 
            className={`filter-option ${currentSort === 'increase' ? 'active' : ''}`}
            onClick={onSortIncrease}
          >
            <img src={AssetsConstant.INCREASE_ICON} alt="increase icon" />
            Tăng dần
          </button>
        </div>
      </div>
    );
  };
  
  export default SortComponent;