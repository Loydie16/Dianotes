import { useEffect, useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, X, Loader2 } from "lucide-react";

import NoteContext from "../../context/NoteContext";
import axiosInstance from "../../utils/axiosInstance";

const FormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
});

function DialogModal({ getAllNotes }) {
  const { isDialogOpen, currentNote, closeModal } = useContext(NoteContext);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [tags, setTags] = useState(currentNote ? currentNote.tags : []);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentNote) {
      form.reset(currentNote);
      setTags(currentNote.tags || []);
    } else {
      form.reset({
        title: "",
        content: "",
      });
      setTags([]); // Reset tags to an empty array when there's no currentNote
    }
  }, [currentNote, form]);

  const onSubmit = async (values) => {
    setLoading(true); 
    try {
      if (currentNote) {
        // Edit note API call
        const response = await axiosInstance.put(
          `/edit-note/${currentNote.noteId}`,
          {
            title: values.title,
            content: values.content,
            tags: tags,
          }
        );

        if (response.data && response.data.note) {
          toast({
            title: "Note Updated",
            description: "Your note has been updated successfully.",
          });
          getAllNotes();
          closeModal();
        }
      } else {
        // Add note API call
        const response = await axiosInstance.post("/add-note", {
          title: values.title,
          content: values.content,
          tags: tags,
        });

        if (response.data && response.data.note) {
          toast({
            title: "Note Added",
            description: "Your note has been added successfully.",
          });
          getAllNotes();
          closeModal();
          form.reset({ title: "", content: "" }); // Reset form fields after adding a new note
          setTags([]); // Reset tags after adding a new note
          setInputValue(""); // Clear input value
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
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // for adding tags using enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      if (tags.includes(inputValue.trim())) return;
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  // add new tags
  const addNewTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  // remove new tags
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        closeModal();
        form.reset({ title: "", content: "" }); // Reset form fields when closing the modal
        setTags([]); // Reset tags when closing the modal
        setInputValue(""); // Clear input value when closing the modal
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentNote ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {currentNote ? "Edit this note." : "Create another note."}
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex. Today's Adventures" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex. Today was one of those days that felt..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Tags</FormLabel>
              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap my-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 text-sm dark:bg-slate-800 bg-[#f6f6f7] pl-3 rounded"
                    >
                      #{tag}
                      <Button
                        className="w-6 h-8"
                        variant="link"
                        size="icon"
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex w-full items-center space-x-2 mt-2">
                <Input
                  type="text"
                  value={inputValue}
                  placeholder="Add Tags"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={addNewTag}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {currentNote ? "Updating..." : "Adding..."}
                </>
              ) : currentNote ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

DialogModal.propTypes = {
  getAllNotes: PropTypes.func.isRequired,
};

export default DialogModal;
