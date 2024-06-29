import { createContext, useState } from "react";
import PropTypes from "prop-types";

const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const openModal = (note = null) => {
    setCurrentNote(note);
    setIsDialogOpen(true);
  };

  const closeModal = () => {
    setIsDialogOpen(false);
    setCurrentNote(null);
  };

  return (
    <NoteContext.Provider
      value={{ isDialogOpen, currentNote, openModal, closeModal }}
    >
      {children}
    </NoteContext.Provider>
  );
}

NoteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NoteContext;