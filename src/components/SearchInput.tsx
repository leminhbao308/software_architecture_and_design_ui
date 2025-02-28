import AssetsConstant from "../consts/AssetsConstant";

const SearchInput = () => {
  return (
    <form className="search">
      <input type="text" className="search-input" placeholder="Searching..." />
      <button type="submit">
        <img src={AssetsConstant.SEARCH_ICON} alt="search icon" />
      </button>
    </form>
  );
};
export default SearchInput;
