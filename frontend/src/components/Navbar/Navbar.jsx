import PropTypes from "prop-types"; // Import PropTypes
import { useState } from "react";
import SearchBar from "../Searchbar/Searchbar";
import ProfileInfo from "../ProfileInfo/ProfileInfo";

function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between h-16 max-w-screen-2xl items-center">
        <h1 className="text-2xl font-medium text-black py-2 dark:text-white">
          Dianotes
        </h1>

        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
          containerStyles="w-2/5 hidden sm:block"
        />
        <ProfileInfo
          userInfo={userInfo}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />
      </div>
    </header>
  );
}

// PropTypes validation
Navbar.propTypes = {
  userInfo: PropTypes.object.isRequired, // Define userInfo as a required object prop
  onSearchNote: PropTypes.func.isRequired, // Define onSearchNote as a required function prop
  handleClearSearch: PropTypes.func.isRequired, // Define handleClearSearch as a required function prop
};

export default Navbar;
