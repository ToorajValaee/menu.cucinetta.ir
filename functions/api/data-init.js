/**
 * Initialize sample data in KV namespace
 * Run this once to populate the menu with sample items
 */

export async function initializeSampleData(kv) {
  const sampleItems = [
    {
      id: "1",
      name: "ROSSO",
      description: "بلونز ، سس گوجه، بشامل",
      price: "835,000 تومان",
      image: "https://via.placeholder.com/520x300?text=ROSSO",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "BOSCO",
      description: "قارچ دکمه ای ، اسفناج ، پرک بادام، سس پنیر و ترافل",
      price: "625,000 تومان",
      image: "https://via.placeholder.com/520x300?text=BOSCO",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "FUOCO",
      description: "سوسیس دستساز ، پیاز کاراملی ، سس فلفل دلمه و چیلی",
      price: "688,000 تومان",
      image: "https://via.placeholder.com/520x300?text=FUOCO",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "LIGURE",
      description: "بوقلمون ، سس پستو و پرتقال و پسته",
      price: "715,000 تومان",
      image: "https://via.placeholder.com/520x300?text=LIGURE",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "CHIARO",
      description: "کدو مسمایی ، گردو ، سس نخود فرنگی",
      price: "485,000 تومان",
      image: "https://via.placeholder.com/520x300?text=CHIARO",
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      name: "آب معدنی لایت",
      price: "20,000 تومان",
      image: "https://via.placeholder.com/520x300?text=Water",
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      name: "آرگو بلک",
      price: "68,000 تومان",
      image: "https://via.placeholder.com/520x300?text=Argo+Black",
      createdAt: new Date().toISOString(),
    },
    {
      id: "8",
      name: "آرگو رازک",
      price: "68,000 تومان",
      image: "https://via.placeholder.com/520x300?text=Argo+Razak",
      createdAt: new Date().toISOString(),
    },
    {
      id: "9",
      name: "اسپرایت",
      price: "48,000 تومان",
      createdAt: new Date().toISOString(),
    },
    {
      id: "10",
      name: "کوکا زیرو",
      price: "48,000 تومان",
      image: "https://via.placeholder.com/520x300?text=Coca+Zero",
      createdAt: new Date().toISOString(),
    },
    {
      id: "11",
      name: "کوکا",
      price: "48,000 تومان",
      image: "https://via.placeholder.com/520x300?text=Coca",
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    await kv.put("items", JSON.stringify(sampleItems));
    console.log("✅ Sample data initialized successfully");
    return sampleItems;
  } catch (error) {
    console.error("❌ Error initializing sample data:", error);
    throw error;
  }
}

/**
 * Clear all data from KV namespace
 * Use with caution - this is irreversible!
 */
export async function clearAllData(kv) {
  try {
    await kv.delete("items");
    console.log("✅ All data cleared");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    throw error;
  }
}

/**
 * Get sample menu data for testing
 */
export function getSampleMenuItems() {
  return [
    {
      id: "1",
      name: "ROSSO",
      description: "بلونز ، سس گوجه، بشامل",
      price: "835,000 تومان",
    },
    {
      id: "2",
      name: "BOSCO",
      description: "قارچ دکمه ای ، اسفناج ، پرک بادام، سس پنیر و ترافل",
      price: "625,000 تومان",
    },
    {
      id: "3",
      name: "FUOCO",
      description: "سوسیس دستساز ، پیاز کاراملی ، سس فلفل دلمه و چیلی",
      price: "688,000 تومان",
    },
  ];
}
