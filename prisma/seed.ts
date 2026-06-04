import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foodData = [
  {
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 24500,
    ingredients: "Mozzarella cheese, Pepperoni, Tomato sauce, Italian herbs",
    image: "pepperoni_pizza.jpg",
  },
  {
    name: "BBQ Chicken Pizza",
    category: "Pizza",
    price: 26000,
    ingredients: "Grilled chicken, BBQ sauce, Red onions, Cilantro, Mozzarella",
    image: "bbq_chicken.jpg",
  },
  {
    name: "Vegetarian Supreme",
    category: "Pizza",
    price: 22000,
    ingredients:
      "Tomato, Bell peppers, Mushrooms, Black olives, Sweet corn, Cheese",
    image: "veggie_supreme.png",
  },
  {
    name: "Four Cheese Pizza",
    category: "Pizza",
    price: 28000,
    ingredients: "Mozzarella, Parmesan, Gorgonzola, Ricotta, Garlic oil",
    image: "four_cheese.jpeg",
  },
];

async function main() {
  console.log(`Залгиж эхэллээ: Өгөгдлийн санг цэвэрлэж байна...`);

  // Хэрэв өмнө нь байсан өгөгдлийг устгахыг хүсвэл (Сонголттой):
  // await prisma.food.deleteMany()

  console.log(`Туршилтын хоолны өгөгдлүүдийг үүсгэж байна...`);

  for (const f of foodData) {
    const food = await prisma.food.create({
      data: f,
    });
    console.log(`Үүссэн хоол: ${food.name} (ID: ${food.id})`);
  }

  console.log(`Амжилттай дууслаа.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
