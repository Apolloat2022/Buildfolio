// scripts/verify-ecommerce-videos.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Verifying e-commerce videos after update...");
  
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: "ecommerce-store" },
    include: {
      steps: {
        select: { order: true, title: true, videoUrl: true },
        orderBy: { order: "asc" }
      }
    }
  });
  
  if (!ecommerce) {
    console.error("E-commerce project not found!");
    return;
  }
  
  console.log(`\n📺 E-commerce Store Videos:`);
  console.log("=" .repeat(50));
  
  ecommerce.steps.forEach(step => {
    const videoId = step.videoUrl ? step.videoUrl.split("/embed/")[1] : "No video";
    console.log(`Step ${step.order}: ${step.title}`);
    console.log(`  Video ID: ${videoId}`);
    console.log(`  URL: ${step.videoUrl || "Missing"}`);
    console.log("");
  });
  
  // Check for placeholder/irrelevant videos
  const badVideos = ["dQw4w9WgXcQ", "PkZNo7MFNFg", "w-7RQ46RgxU", "3sK3wJAxGfs", 
                     "bMknfKXIFA8", "c8C8ip6fU4c", "9Omnm5Eyx1Y"];
  
  let hasBadVideos = false;
  ecommerce.steps.forEach(step => {
    if (step.videoUrl) {
      badVideos.forEach(badId => {
        if (step.videoUrl.includes(badId)) {
          console.log(`⚠️  WARNING: Step ${step.order} still has placeholder video!`);
          hasBadVideos = true;
        }
      });
    }
  });
  
  if (!hasBadVideos) {
    console.log("✅ All videos appear to be real tutorials!");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
