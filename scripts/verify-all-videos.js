// scripts/verify-all-videos.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 VERIFYING ALL E-COMMERCE VIDEOS");
  console.log("==================================");
  
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: "ecommerce-store" },
    include: {
      steps: {
        select: { 
          order: true, 
          title: true, 
          videoUrl: true,
          description: true 
        },
        orderBy: { order: "asc" }
      }
    }
  });
  
  if (!ecommerce) {
    console.error("❌ E-commerce project not found!");
    return;
  }
  
  console.log(`\n📋 Project: ${ecommerce.title}`);
  
  // Expected video IDs (the correct ones)
  const expectedVideos = [
    "F8ZkZJ9fPs0", // Next.js Setup
    "69MB3F8lKxY", // Prisma
    "pUNSHPyVryU", // Tailwind Product Grid
    "7m11P4bLtYM", // Zustand Cart
    "UkF0P59lN6s", // Stripe
    "1MTyCvS05V8", // NextAuth
    "mTz0GXj8NN0"  // Vercel Deployment
  ];
  
  // Bad video IDs to watch for
  const badVideos = [
    "__mSgDEOyv8", // Rick Astley (rickroll)
    "wfUg9zKlgqU", // Secret to Success
    "dQw4w9WgXcQ", // Another rickroll
    "PkZNo7MFNFg", // JavaScript tutorial
    "w-7RQ46RgxU", // React tutorial
    "3sK3wJAxGfs", // Programming music
    "bMknfKXIFA8", // Coding background
    "c8C8ip6fU4c", // Unknown
    "9Omnm5Eyx1Y"  // Unknown
  ];
  
  let allCorrect = true;
  
  console.log("\n📺 STEP-BY-STEP VIDEO CHECK:");
  console.log("=" .repeat(60));
  
  ecommerce.steps.forEach((step, index) => {
    const videoId = step.videoUrl ? step.videoUrl.split("/embed/")[1]?.split("?")[0] : "NO_VIDEO";
    const expectedId = expectedVideos[index] || "UNKNOWN";
    const isBad = badVideos.includes(videoId);
    const isCorrect = videoId === expectedId;
    
    console.log(`\nStep ${step.order}: ${step.title}`);
    console.log(`  Current Video ID: ${videoId}`);
    
    if (isBad) {
      console.log(`  ❌ BAD: This is NOT an e-commerce tutorial!`);
      allCorrect = false;
    } else if (isCorrect) {
      console.log(`  ✅ CORRECT: Proper tutorial video`);
    } else if (videoId === "NO_VIDEO") {
      console.log(`  ⚠️  MISSING: No video assigned`);
      allCorrect = false;
    } else {
      console.log(`  ⚠️  DIFFERENT: Has video but not the expected one`);
    }
    
    // Show video topic match
    const stepTopic = step.title.toLowerCase();
    if (stepTopic.includes("setup") && !videoId.includes("F8ZkZJ9fPs0")) {
      console.log(`  ⚠️  Should be Next.js setup tutorial`);
    } else if (stepTopic.includes("database") && !videoId.includes("69MB3F8lKxY")) {
      console.log(`  ⚠️  Should be Prisma database tutorial`);
    } else if (stepTopic.includes("cart") && !videoId.includes("7m11P4bLtYM")) {
      console.log(`  ⚠️  Should be shopping cart tutorial`);
    }
  });
  
  console.log("\n" + "=" .repeat(60));
  
  if (allCorrect) {
    console.log("🎉 SUCCESS! All videos are correct e-commerce tutorials!");
  } else {
    console.log("⚠️  Some videos need fixing. Re-run add-real-videos.ts");
  }
  
  console.log("\n🌐 Test URL: https://buildfolio.tech/projects/ecommerce-store");
}

main().catch(console.error).finally(() => prisma.$disconnect());
