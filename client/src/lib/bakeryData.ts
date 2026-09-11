export type GalleryItem = {
  id: number;
  title: string;
  category: "Weddings" | "Birthdays" | "Little Cakes" | "Cookies";
  image: string;
  alt: string;
};

export const galleryItems: GalleryItem[] = [
  { id: 1, title: "Garden tier", category: "Weddings", image: "/images/photo-1578985545062-69928b1d9587.jpg", alt: "Flower-topped celebration cake" },
  { id: 2, title: "Pistachio cloud", category: "Little Cakes", image: "/images/photo-1602351447937-745cb720612f.jpg", alt: "Small frosted cake" },
  { id: 3, title: "Birthday blush", category: "Birthdays", image: "/images/photo-1559620192-032c4bc4674e.jpg", alt: "Pink birthday cake" },
  { id: 4, title: "Lemon garden", category: "Birthdays", image: "/images/photo-1535254973040-607b474cb50d.jpg", alt: "Decorated lemon cake" },
  { id: 5, title: "Wildflower vows", category: "Weddings", image: "/images/photo-1578985545062-69928b1d9587.jpg", alt: "Wedding cake with flowers" },
  { id: 6, title: "Butter shortbread", category: "Cookies", image: "/images/photo-1499636136210-6f4ee915583e.jpg", alt: "Fresh baked cookies" },
];

export const menuItems = [
  { title: "Signature cake", detail: "Two plush layers, hand-finished in our signature textured buttercream.", price: "from $84", image: galleryItems[0].image, tag: "Celebrations" },
  { title: "Petite cake", detail: "A sweet six-inch centerpiece for smaller, very special tables.", price: "from $54", image: galleryItems[1].image, tag: "Serves 4–8" },
  { title: "Cupcake dozen", detail: "Twelve floral-topped cupcakes in two complementary seasonal flavors.", price: "from $42", image: "/images/photo-1551024506-0bccd828d307.jpg", tag: "Seasonal" },
  { title: "Decorated cookies", detail: "Buttery vanilla cookies, iced one by one to suit the occasion.", price: "from $34", image: galleryItems[5].image, tag: "By the dozen" },
];

export const faqItems = [
  { question: "How much notice do you need?", answer: "Custom cakes are usually available with five full days’ notice. The live order calendar shows exactly which dates are open, and a limited rush option appears when our kitchen can accommodate it." },
  { question: "What is your cancellation policy?", answer: "Orders may be moved once with at least seven days’ notice, subject to availability. Deposits reserve ingredients and studio time, and are non-refundable within seven days of pickup." },
  { question: "Can you accommodate allergies?", answer: "We can note dietary needs and offer selected gluten-conscious or nut-free designs. Our kitchen handles wheat, dairy, eggs, and tree nuts, so we cannot guarantee an allergen-free environment." },
  { question: "Do you deliver?", answer: "Yes. Local delivery is available within our Portland delivery zone for a flat fee. The order studio will display delivery details when you select that option." },
];
