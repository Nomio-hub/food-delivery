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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const form = new FormData();
    form.append("file", e.target.files[0]);
    setUploading(true);
    try {
      const res = await axios.put("/api/upload", form);
      setImage(res.data.url);
    } catch {
      alert("Зураг upload хийхэд алдаа гарлаа");
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
      onClose();
      window.location.reload();
    } catch {
      alert("Засварлахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || uploading;

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
              <img
                src={image}
                alt={name}
                className="mt-1 max-w-full h-auto rounded-md"
              />
            )}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={busy}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={busy} onClick={handleSubmit}>
            {uploading ? "Uploading…" : loading ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
