import { useState } from "react";
import {
  LogOut,
  Mail,
  User,
  UserCog,
  Moon,
  Sun,
  Settings2,
  PenLine,
  Loader2,
} from "lucide-react";

import { toast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import { useTheme } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import DialogChangePass from "@/components/DialogChangePass/DialogChangePass";

import SearchBar from "../Searchbar/Searchbar";

function ProfileInfo({ userInfo, onSearchNote, handleClearSearch }) {
  const { setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const navigate = useNavigate();

  //logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/logout");
      navigate("/login");
      toast({
        title: "Logout Succesfull",
        description: "Goodbye!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <UserCog />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 sm:w-56 mx-4 ">
          <DropdownMenuLabel className="justify-center items-center flex sm:hidden">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => {
                setSearchQuery(target.value);
              }}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
              containerStyles="w-full sm:hidden"
            />
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="sm:hidden" />
          <DropdownMenuLabel className="justify-center items-center flex">
            Account Settings
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex">
            <User className="mr-2 h-4 w-4" />
            {userInfo.userName}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="flex text-[11px]">
            <Mail className="mr-2 h-4 w-4" />
            {userInfo.email}
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setShowChangePasswordDialog(true)}
          >
            <PenLine className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>

          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="justify-center items-center flex sm:hidden">
              Theme:
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem
              className="hover:cursor-pointer sm:hidden"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer sm:hidden"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer sm:hidden"
              onClick={() => setTheme("system")}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="hidden sm:flex">
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => setTheme("system")}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setShowAlertDialog(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Logging out will end your current session. You will need to log in
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Yes
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogChangePass
        isOpen={showChangePasswordDialog}
        onClose={() => setShowChangePasswordDialog(false)}
      />
    </>
  );
}

export default ProfileInfo;
