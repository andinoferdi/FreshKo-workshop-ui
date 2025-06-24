export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  tags: string[];
  isEditable?: boolean;
  createdBy?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Tips for Storing Fresh Produce",
    excerpt:
      "Learn how to keep your fruits and vegetables fresh for longer with these expert storage tips.",
    content: `
      <p>Proper storage of fresh produce is essential for maintaining nutritional value and extending shelf life. Here are our top 10 tips:</p>
      
      <h3>1. Understand Ethylene Production</h3>
      <p>Some fruits like apples, bananas, and tomatoes produce ethylene gas, which can accelerate ripening in nearby produce. Store these separately from ethylene-sensitive items like leafy greens and herbs.</p>
      
      <h3>2. Use the Crisper Drawers</h3>
      <p>Your refrigerator's crisper drawers are designed to maintain optimal humidity levels. Use the high-humidity drawer for leafy greens and the low-humidity drawer for fruits.</p>
      
      <h3>3. Don't Wash Before Storing</h3>
      <p>Excess moisture can lead to faster spoilage. Wash your produce just before eating or cooking.</p>
      
      <h3>4. Store Potatoes in Dark, Cool Places</h3>
      <p>Light can cause potatoes to turn green and develop a bitter taste. Store them in a cool, dark pantry or cellar.</p>
      
      <h3>5. Keep Onions and Potatoes Separate</h3>
      <p>Storing these together can cause both to spoil faster due to the gases they emit.</p>
      
      <p>Following these simple guidelines will help you reduce food waste and enjoy fresher produce for longer periods.</p>
    `,
    author: "Sarah Johnson",
    date: "2024-01-15",
    category: "tips",
    image: "/images/post-thumb-1.jpg",
    tags: ["storage", "freshness", "tips", "produce"],
  },
  {
    id: 2,
    title: "The Benefits of Eating Seasonal Produce",
    excerpt:
      "Discover why choosing seasonal fruits and vegetables is better for your health, wallet, and the environment.",
    content: `
      <p>Eating seasonal produce offers numerous benefits that extend beyond just taste. Here's why you should consider making seasonal eating a priority:</p>
      
      <h3>Nutritional Benefits</h3>
      <p>Seasonal produce is typically harvested at peak ripeness, meaning it contains the highest levels of vitamins, minerals, and antioxidants. When fruits and vegetables are allowed to ripen naturally on the plant, they develop their full nutritional profile.</p>
      
      <h3>Better Flavor</h3>
      <p>There's nothing quite like the taste of a tomato picked at the height of summer or a crisp apple in the fall. Seasonal produce simply tastes better because it's fresher and hasn't traveled long distances.</p>
      
      <h3>Environmental Impact</h3>
      <p>Choosing seasonal, local produce reduces the carbon footprint associated with transportation and storage. It also supports sustainable farming practices in your local area.</p>
      
      <h3>Cost Savings</h3>
      <p>When produce is in season locally, it's typically more abundant and therefore less expensive. You can enjoy premium quality at better prices.</p>
      
      <h3>Supporting Local Economy</h3>
      <p>Buying seasonal produce often means supporting local farmers and businesses, which strengthens your community's economy.</p>
      
      <p>Start small by incorporating one or two seasonal items into your weekly shopping, and gradually build up to eating more seasonally throughout the year.</p>
    `,
    author: "Mike Chen",
    date: "2024-01-12",
    category: "nutrition",
    image: "/images/post-thumb-2.jpg",
    tags: ["seasonal", "nutrition", "environment", "local"],
  },
  {
    id: 3,
    title: "Quick and Healthy Meal Prep Ideas",
    excerpt:
      "Save time and eat healthier with these simple meal prep strategies using fresh ingredients.",
    content: `
      <p>Meal prepping doesn't have to be complicated or time-consuming. With the right strategies and fresh ingredients, you can prepare healthy meals for the entire week in just a few hours.</p>
      
      <h3>Start with a Plan</h3>
      <p>Before you shop, plan your meals for the week. Choose recipes that share similar ingredients to minimize waste and maximize efficiency.</p>
      
      <h3>Prep Ingredients, Not Just Meals</h3>
      <p>Instead of cooking complete meals, try prepping individual components:</p>
      <ul>
        <li>Wash and chop vegetables</li>
        <li>Cook grains like rice and quinoa</li>
        <li>Prepare proteins in bulk</li>
        <li>Make sauces and dressings</li>
      </ul>
      
      <h3>Invest in Quality Containers</h3>
      <p>Good storage containers keep your prepped ingredients fresh longer. Glass containers are ideal as they're microwave-safe and don't retain odors.</p>
      
      <h3>Batch Cooking Basics</h3>
      <p>Some foods are perfect for batch cooking:</p>
      <ul>
        <li>Soups and stews</li>
        <li>Roasted vegetables</li>
        <li>Cooked grains and legumes</li>
        <li>Hard-boiled eggs</li>
      </ul>
      
      <h3>Keep It Fresh</h3>
      <p>Add fresh elements like herbs, avocado, or crisp vegetables just before eating to maintain texture and flavor.</p>
      
      <p>Remember, meal prep is about making your life easier, not more stressful. Start small and find what works for your lifestyle.</p>
    `,
    author: "Emma Davis",
    date: "2024-01-10",
    category: "cooking",
    image: "/images/post-thumb-3.jpg",
    tags: ["meal-prep", "healthy", "cooking", "time-saving"],
  },
  {
    id: 4,
    title: "Healthy Eating: 5 Superfoods You Should Include in Your Diet",
    excerpt:
      "Discover the power of superfoods and how they can transform your health. Learn about the top 5 superfoods that should be part of your daily nutrition...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-1.jpg",
    date: "15 Dec 2023",
    category: "health",
    author: "Nutritionist",
    tags: ["health", "nutrition", "superfoods", "diet"],
  },
  {
    id: 5,
    title: "Organic vs Conventional: Making the Right Choice for Your Family",
    excerpt:
      "Understanding the differences between organic and conventional produce can help you make informed decisions for your family's health and budget...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-2.jpg",
    date: "10 Dec 2023",
    category: "organic",
    author: "Food Expert",
    tags: ["organic", "conventional", "family", "health"],
  },
  {
    id: 6,
    title: "Seasonal Produce Guide: What to Buy When",
    excerpt:
      "Eating seasonally not only saves money but also ensures you get the freshest, most nutritious produce. Here's your complete seasonal guide...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-3.jpg",
    date: "5 Dec 2023",
    category: "seasonal",
    author: "Chef",
    tags: ["seasonal", "produce", "fresh", "guide"],
  },
];

export const getRelatedPosts = (
  currentPostId: number,
  category: string,
  limit = 3
): BlogPost[] => {
  return blogPosts
    .filter((post) => post.id !== currentPostId && post.category === category)
    .slice(0, limit);
};
