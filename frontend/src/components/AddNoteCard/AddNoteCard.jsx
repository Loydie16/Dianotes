import { useContext } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoteProvider from "../../context/NoteContext";

function AddNoteCard({ className }) {
  const { openModal } = useContext(NoteProvider);

  return (
    <Card className={`items-center flex flex-col justify-center ${className}`}>
      <CardContent className="flex justify-center p-0">
        <Button
          variant="ghost"
          className="h-20 w-20 mt-4"
          onClick={() => openModal()}
        >
          <SquarePlus className="h-20 w-20" />
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center text-2xl">
        Add Note
      </CardFooter>
    </Card>
  );
}

export default AddNoteCard;
