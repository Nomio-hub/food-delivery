"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Category = { id: string; name: string };

export const CategoryCreateDialog = ({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category?: Category; // байвал edit/delete горим
}) => {
  const [name, setName] = useState(category?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!category;
  const busy = loading || deleting;

  const handleOnSubmit = () => {
    setLoading(true);
    const request = isEdit
      ? axios.patch(`/api/foods/categories/${category.id}`, { name })
      : axios.post("/api/foods/categories", { name });

    request
      .then(() => {
        toast.success(
          isEdit
            ? "Категори амжилттай засагдлаа"
            : "Категори амжилттай нэмэгдлээ",
        );
        setLoading(false);
        onClose();
        window.location.reload();
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message || "Алдаа гарлаа");
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (!category) return;
    toast(`"${category.name}" категорийг устгах уу?`, {
      action: {
        label: "Устгах",
        onClick: async () => {
          setDeleting(true);
          try {
            await axios.delete(`/api/foods/categories/${category.id}`);
            toast.success("Категори устгагдлаа");
            onClose();
            window.location.reload();
          } catch {
            toast.error("Устгахад алдаа гарлаа");
          } finally {
            setDeleting(false);
          }
        },
      },
      cancel: {
        label: "Болих",
        onClick: () => {},
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit food category" : "Create food category"}
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              name="name"
              placeholder="Pizza..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="flex items-center justify-between gap-2">
          {isEdit ? (
            <Button
              variant="outline"
              size="icon"
              disabled={busy}
              onClick={handleDelete}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
            >
              {deleting ? (
                <span className="text-xs">…</span>
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={busy}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={busy} onClick={handleOnSubmit}>
              {loading ? "Хадгалж байна…" : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
