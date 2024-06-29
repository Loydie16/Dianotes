import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

function Searchbar({ value, onChange, handleSearch, onClearSearch, containerStyles }) {

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    } 
     if (event.key === "Enter" && value === "") {
      onClearSearch();
    }
  };
  
  return (
    <div className={`relative ${containerStyles}`}>
      <Input
        type="text"
        className="w-full text-xs bg-transparent py-[11px]  outline-none"
        placeholder="Search Notes"
        value={value}
        onKeyDown={handleKeyDown}
        onChange={onChange}
      />
      {value && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 ">
          <X
            className="cursor-pointer text-slate-500 hover:text-black dark:text-slate-500  hover:dark:text-slate-200"
            onClick={onClearSearch}
          />
        </div>
      )}

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 ">
        <Search className="cursor-pointer text-slate-500 hover:text-black dark:text-slate-500  hover:dark:text-slate-200" onClick={handleSearch}/>
      </div>
    </div>
  );
}

Searchbar.propTypes = {
  value: PropTypes.string.isRequired,
  containerStyles: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default Searchbar;
