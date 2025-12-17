// scripts/reset-ecommerce-videos.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔄 RESETTING e-commerce videos...");
  
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
  
  // Clear ALL video URLs
  for (const step of ecommerce.steps) {
    await prisma.step.update({
      where: { id: step.id },
      data: { videoUrl: null }
    });
    console.log(`Cleared video for Step ${step.order}`);
  }
  
  console.log("\n✅ All videos cleared!");
  console.log("Now run: npx tsx scripts/add-real-videos.ts");
}

main().catch(console.error).finally(() => prisma.$disconnect());
