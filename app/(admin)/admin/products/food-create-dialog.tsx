"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FoodCategoryWithFoods } from "./page";

export const FoodCreateDialog = ({
  open,
  onClose,
  categories,
  foodCategoryId,
}: {
  open: boolean;
  onClose: () => void;
  categories: FoodCategoryWithFoods[];
  foodCategoryId: string;
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = () => {
    setLoading(true);
    axios
      .post("/api/foods", {
        name,
        image,
        price,
        ingredients,
        foodCategoryId,
      })
      .then((res) => {
        alert("Food added");
        setLoading(false);
        onClose();
        window.location.reload();
      })
      .catch(({ response }) => {
        alert("Aldaa");
      });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create food</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              name="name"
              placeholder="Pizza..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Field>
          <Field>
            <Label htmlFor="category-1">Category</Label>
            <Select defaultValue={foodCategoryId} value={foodCategoryId}>
              <SelectTrigger id="category-1" className="w-full max-w-48">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((cat) => (
                    <SelectItem value={cat.id} key={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="price-1">Price</Label>
            <Input
              id="price-1"
              name="price"
              placeholder="12.99"
              type="number"
              value={price}
              onChange={(e) => {
                if (Number(e.target.value)) {
                  setPrice(Number(e.target.value));
                }
              }}
            />
          </Field>
          <Field>
            <Label htmlFor="ingredients-1">Ingredients</Label>
            <Textarea
              id="ingredients-1"
              name="ingredients"
              placeholder="Tomato, Cabbage, Cheese...."
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
              }}
            />
          </Field>
          <Field>
            <Label htmlFor="image-1">Image</Label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const form = new FormData();
                  form.append("file", e.target.files[0]);
                  axios.put("/api/upload", form).then((res) => {
                    setImage(res.data.url);
                  });
                }
              }}
            />
            {image && <img src={image} alt={name} className="max-w-full h-auto" />}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading} onClick={handleOnSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
