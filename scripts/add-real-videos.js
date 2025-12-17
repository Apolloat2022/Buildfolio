// scripts/add-real-videos.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🎬 Adding real YouTube videos to e-commerce project...");
  
  // E-commerce store real tutorial videos (example IDs)
  const ecommerceVideos = [
    "dQw4w9WgXcQ", // Placeholder - replace with actual tutorial video IDs
    "PkZNo7MFNFg", 
    "w-7RQ46RgxU",
    "3sK3wJAxGfs",
    "bMknfKXIFA8",
    "c8C8ip6fU4c",
    "9Omnm5Eyx1Y"
  ];
  
  // Get e-commerce steps
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: "ecommerce-store" },
    include: {
      steps: {
        orderBy: { order: "asc" }
      }
    }
  });
  
  if (!ecommerce) {
    console.error("E-commerce project not found!");
    return;
  }
  
  console.log(`Found ${ecommerce.steps.length} steps for e-commerce`);
  
  // Update each step with a real video
  for (let i = 0; i < ecommerce.steps.length; i++) {
    const step = ecommerce.steps[i];
    const videoId = ecommerceVideos[i] || "dQw4w9WgXcQ";
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    
    await prisma.step.update({
      where: { id: step.id },
      data: { videoUrl }
    });
    
    console.log(`✅ Step ${step.order}: Updated video URL`);
  }
  
  console.log("\n📺 Real YouTube videos added!");
  console.log("Note: These are placeholder video IDs. Replace with actual tutorial video IDs.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
