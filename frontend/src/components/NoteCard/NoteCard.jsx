import { useContext } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pin, Pencil, Trash2 } from "lucide-react";
import NoteProvider from "../../context/NoteContext";
import moment from "moment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function NoteCard({
  noteId,
  title,
  date,
  content,
  tags,
  isPinned,
  onDelete,
  onPinNote,
}) {
  const { openModal } = useContext(NoteProvider);
  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">
            {moment(date).format("Do MMM YYYY")}
          </CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onPinNote}>
                <Pin className={`${isPinned ? "text-blue-500" : ""} h-5 w-5`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{`${isPinned ? "Unpin this note" : "Pin this note"}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex-grow text-justify">
        <p className="text-md ">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto items-end">
        <div className="flex flex-wrap gap-2 items-center ">
          {tags.map((item, index) => (
            <span
              key={index}
              className="text-xs dark:bg-slate-800 bg-[#f6f6f7] p-2 rounded-md"
            >
              #{item}
            </span>
          ))}
        </div>
        <div className="flex flex-row justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    openModal({ title, date, content, tags, noteId })
                  }
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit this note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete this note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}

NoteCard.propTypes = {
  noteId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  tags: PropTypes.node,
  isPinned: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPinNote: PropTypes.func.isRequired,
};

export default NoteCard;
