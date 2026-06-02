import { ProductCard, type Product } from "./product-card";

const DESCRIPTION =
  "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.";

const p = (n: number) => `/menu/p${n}.png`;

const SECTIONS: { title: string; products: Product[] }[] = [
  {
    title: "Appetizers",
    products: [
      { name: "Finger food", description: DESCRIPTION, price: "$12.99", image: p(1) },
      { name: "Cranberry Brie Bites", description: DESCRIPTION, price: "$12.99", image: p(2) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(3) },
      { name: "Brie Crostini Appetizer", description: DESCRIPTION, price: "$12.99", image: p(4) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(5) },
      { name: "Grilled chicken", description: DESCRIPTION, price: "$12.99", image: p(6) },
    ],
  },
  {
    title: "Salads",
    products: [
      { name: "Grilled Chicken Cobb Salad", description: DESCRIPTION, price: "$12.99", image: p(7) },
      { name: "Burrata Caprese", description: DESCRIPTION, price: "$12.99", image: p(8) },
      { name: "Beetroot and Orange Salad", description: DESCRIPTION, price: "$12.99", image: p(9) },
    ],
  },
  {
    title: "Lunch favorites",
    products: [
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(10) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(11) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(12) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(13) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(1) },
    ],
  },
  {
    title: "Desserts",
    products: [
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(2) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(3) },
      { name: "Sunshine Stackers", description: DESCRIPTION, price: "$12.99", image: p(4) },
    ],
  },
];

export function Menu() {
  return (
    <section className="bg-primary">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-6 py-14 sm:px-12 lg:px-[88px]">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-6">
            <h2 className="text-[30px] font-semibold leading-9 tracking-tight text-white">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
              {section.products.map((product, i) => (
                <ProductCard key={`${section.title}-${i}`} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
