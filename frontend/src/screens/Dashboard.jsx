import { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import NoteCard from "../components/NoteCard/NoteCard";
import AddNoteCard from "@/components/AddNoteCard/AddNoteCard";
import DialogModal from "@/components/DialogModal/DialogModal";
import NoteProvider from "../context/NoteContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "@/components/ui/use-toast";
import EmptyCard from "@/components/EmptyCard/EmptyCard";
import NoSearch from "@/components/NoSearch/NoSearch";
import SkeletonNoteCard from "@/components/SkeletonNoteCard/SkeletonNoteCard"; // Import Skeleton component
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


function Dashboard() {
  const { openModal } = useContext(NoteProvider);

  const [userInfo, setUserInfo] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [deleteLoading, setDeleteLoading] = useState(false); 
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const navigate = useNavigate();

  // Get user information
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        await axiosInstance.post("/logout");
        navigate("/login");
      }
    }
  };

  // Get all notes
  const getAllNotes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error ito:",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const deleteNote = async () => {
    setDeleteLoading(true)
    try {
      if (noteToDelete) {
        const response = await axiosInstance.delete(
          `/delete-note/${noteToDelete._id}`
        );

        if (response.data && !response.data.error) {
          toast({
            title: "Note Deleted",
            description: "Your note has been deleted successfully.",
          });
          getAllNotes();
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast({
          title: "Error",
          description: error.response.data.message,
        });
      }
    } finally {
      setShowAlertDialog(false);
      setNoteToDelete(null);
      setDeleteLoading(false)
    }
  };

  const confirmDelete = (note) => {
    setNoteToDelete(note);
    setShowAlertDialog(true);
  };

  // Search for a note
  const onSearchNote = async (query) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }

  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Pin note
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(
        `/update-note-pinned/${noteId}`,
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.note) {
        toast({
          title: noteData.isPinned ? "Unpinned Note" : "Pinned Note",
          description: `The note has been ${
            noteData.isPinned ? "unpinned" : "pinned"
          } successfully.`,
        });
        getAllNotes();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <main className="container mx-auto">
        {loading ? ( // Show skeletons while loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {Array.from({ length: allNotes.length + 1 }).map((_, index) => (
              <SkeletonNoteCard key={index} />
            ))}
          </div>
        ) : allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {allNotes.map((note) => (
              <NoteCard
                key={note._id}
                noteId={note._id}
                title={note.title}
                description="Note Description"
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onDelete={() => confirmDelete(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
            <AddNoteCard onAddNote={() => openModal()} />
          </div>
        ) : (
          <>
            {isSearch ? (
              <NoSearch />
            ) : (
              <>
                <EmptyCard />
                <AddNoteCard
                  onAddNote={() => openModal()}
                  className="w-1/4 mt-20 mx-auto"
                />
              </>
            )}
          </>
        )}
      </main>
      <DialogModal getAllNotes={getAllNotes} />

      {/* Alert Dialog for delete confirmation */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this note?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={deleteLoading} onClick={deleteNote}>
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Dashboard;
