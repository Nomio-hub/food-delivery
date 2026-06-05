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
import { Textarea } from "@/components/ui/textarea";
import { Food } from "@/app/generated/prisma/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function FoodEditDialog({
  food,
  open,
  onClose,
}: {
  food: Food;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState(food.name);
  const [price, setPrice] = useState(food.price);
  const [ingredients, setIngredients] = useState(food.ingredients);
  const [image, setImage] = useState(food.image);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const form = new FormData();
    form.append("file", e.target.files[0]);
    setUploading(true);
    try {
      const res = await axios.put("/api/upload", form);
      setImage(res.data.url);
    } catch {
      toast.error("Зураг upload хийхэд алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (uploading) return;
    setLoading(true);
    try {
      await axios.patch(`/api/foods/${food.id}`, {
        name,
        price,
        ingredients,
        image,
      });
      toast.success("Хоол амжилттай засагдлаа");
      onClose();
      window.location.reload();
    } catch {
      toast.error("Засварлахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${name}" хоолыг устгах уу?`)) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/foods/${food.id}`);
      toast.success("Хоол устгагдлаа");
      onClose();
      window.location.reload();
    } catch {
      toast.error("Устгахад алдаа гарлаа");
    } finally {
      setDeleting(false);
    }
  };

  const busy = loading || uploading || deleting;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit food</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Field>
          <Field>
            <Label>Ingredients</Label>
            <Textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </Field>
          <Field>
            <Label>Image</Label>
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={handleImageChange}
            />
            {uploading && (
              <p className="text-xs text-zinc-400">Upload хийж байна…</p>
            )}
            {image && (
              <div className="relative mt-1 inline-block">
                <img
                  src={image}
                  alt={name}
                  className="max-w-full h-auto rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white/80 text-zinc-500 hover:bg-white hover:text-red-500 shadow"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </Field>
        </FieldGroup>
        <DialogFooter className="flex items-center justify-between gap-2">
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
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={busy}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={busy} onClick={handleSubmit}>
              {uploading ? "Uploading…" : loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
