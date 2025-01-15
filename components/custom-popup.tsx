"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomPopupProps {
  title: string;
  description?: string;
  showAccept?: boolean;
  showCancel?: boolean;
  onAccept?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomPopup({
  title,
  description,
  showAccept = true,
  showCancel = true,
  onAccept,
  onCancel,
  children,
  open,
  onOpenChange,
}: CustomPopupProps) {
  const handleAccept = () => {
    if (onAccept) onAccept();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          {showCancel && (
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
          {showAccept && <Button onClick={handleAccept}>Aceptar</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
