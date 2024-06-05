"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface Props {
  item: string;
  handleConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function DialogConfirmation({
  handleConfirm,
  item,
  loading,
  open,
  setIsLoading,
  setOpen,
}: Props) {
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your{" "}
            {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <Button
            onClick={() => {
              setIsLoading(true);
              handleConfirm();
            }}
            disabled={loading}
          >
            {loading && <Spinner />}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
