// scripts/fix-everything.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🔧 COMPREHENSIVE FIX FOR E-COMMERCE PROJECT");
  console.log("===========================================");
  
  // 1. Check current state
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: "ecommerce-store" },
    include: {
      steps: {
        include: { quizQuestions: true },
        orderBy: { order: "asc" }
      }
    }
  });
  
  if (!ecommerce) {
    console.error("❌ E-commerce project not found!");
    return;
  }
  
  console.log(`\n📊 Current Status:`);
  console.log(`   Project: ${ecommerce.title}`);
  console.log(`   Steps: ${ecommerce.steps.length}`);
  
  // 2. Check videos
  console.log(`\n🎬 YouTube Videos:`);
  ecommerce.steps.forEach(step => {
    const hasVideo = step.videoUrl && step.videoUrl.includes("youtube.com/embed/");
    console.log(`   Step ${step.order}: ${hasVideo ? "✅ Has video" : "❌ Missing/placeholder"}`);
    if (step.videoUrl) {
      console.log(`        URL: ${step.videoUrl.substring(0, 60)}...`);
    }
  });
  
  // 3. Check quiz questions
  console.log(`\n🎯 Quiz Questions:`);
  ecommerce.steps.forEach(step => {
    const hasExplanations = step.quizQuestions.some(q => q.explanation && q.explanation.length > 10);
    console.log(`   Step ${step.order}: ${step.quizQuestions.length} questions, ${hasExplanations ? "✅ Has explanations" : "❌ Generic questions"}`);
  });
  
  console.log("\n🚀 RECOMMENDED ACTIONS:");
  console.log("   1. Run: npx tsx scripts/add-real-videos.ts (if exists)");
  console.log("   2. Run: npx tsx scripts/enrich-all-projects.ts (again)");
  console.log("   3. Check components/QuizModal.tsx for answer display logic");
  console.log("\n🌐 Test: https://buildfolio.tech/projects/ecommerce-store");
}

main().catch(console.error).finally(() => prisma.$disconnect());
