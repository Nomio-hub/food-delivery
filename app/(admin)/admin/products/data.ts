const DESCRIPTION =
  "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.";

const img = (n: number) => `/menu/p${n}.png`;

export type Product = {
  name: string;
  description: string;
  price: string;
  image: string;
};

export type Section = {
  id: string;
  title: string;
  count: number;
  products: Product[];
};

export const SECTIONS: Section[] = [
  {
    id: "appetizers",
    title: "Appetizers",
    count: 6,
    products: [
      { name: "Brie Crostini Appetizer", description: DESCRIPTION, price: "$12.99", image: img(1) },
      { name: "Cranberry Brie Bites", description: DESCRIPTION, price: "$12.99", image: img(2) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: img(3) },
      { name: "Finger food", description: DESCRIPTION, price: "$12.99", image: img(4) },
      { name: "Grilled chicken", description: DESCRIPTION, price: "$12.99", image: img(5) },
      { name: "Cheese boards", description: DESCRIPTION, price: "$12.99", image: img(6) },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    count: 3,
    products: [
      { name: "Grilled Chicken cobb salad", description: DESCRIPTION, price: "$12.99", image: img(7) },
      { name: "Burrata Caprese", description: DESCRIPTION, price: "$12.99", image: img(8) },
      { name: "Betroot and orange salad", description: DESCRIPTION, price: "$12.99", image: img(9) },
    ],
  },
  {
    id: "pizzas",
    title: "Pizzas",
    count: 5,
    products: [
      { name: "Margherita", description: DESCRIPTION, price: "$12.99", image: img(10) },
      { name: "Quattro Formaggi", description: DESCRIPTION, price: "$12.99", image: img(11) },
      { name: "Diavola", description: DESCRIPTION, price: "$12.99", image: img(12) },
      { name: "Prosciutto Funghi", description: DESCRIPTION, price: "$12.99", image: img(13) },
      { name: "Capricciosa", description: DESCRIPTION, price: "$12.99", image: img(1) },
    ],
  },
];

export const CATEGORIES: { id: string; label: string; count: number }[] = [
  { id: "all", label: "All Dishes", count: 112 },
  { id: "appetizers", label: "Appetizers", count: 6 },
  { id: "salads", label: "Salads", count: 3 },
  { id: "pizzas", label: "Pizzas", count: 5 },
  { id: "lunch", label: "Lunch favorites", count: 5 },
  { id: "main", label: "Main dishes", count: 5 },
  { id: "fish", label: "Fish & Sea foods", count: 5 },
  { id: "brunch", label: "Brunch", count: 5 },
  { id: "side", label: "Side dish", count: 5 },
  { id: "desserts", label: "Desserts", count: 5 },
  { id: "beverages", label: "Beverages", count: 5 },
];
