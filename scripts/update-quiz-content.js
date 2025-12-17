// scripts/update-quiz-content.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("📝 Updating quiz questions with real content...");
  
  // Get e-commerce project
  const ecommerce = await prisma.projectTemplate.findUnique({
    where: { slug: "ecommerce-store" },
    include: {
      steps: {
        include: {
          quizQuestions: {
            orderBy: { order: "asc" }
          }
        },
        orderBy: { order: "asc" }
      }
    }
  });
  
  if (!ecommerce) {
    console.error("E-commerce project not found!");
    return;
  }
  
  // Real quiz questions for e-commerce tutorial
  const stepQuestions = [
    // Step 1: Project Setup
    [
      {
        question: "Which command creates a new Next.js 14 project with TypeScript?",
        options: [
          "npx create-next-app@latest",
          "npm init next-app",
          "yarn create next-app --typescript",
          "next new project"
        ],
        correctIndex: 0,
        explanation: "npx create-next-app@latest is the official command and prompts for TypeScript configuration."
      },
      {
        question: "What is the purpose of Prisma in this project?",
        options: [
          "CSS framework",
          "ORM for database access",
          "Authentication library",
          "Deployment tool"
        ],
        correctIndex: 1,
        explanation: "Prisma is an ORM (Object-Relational Mapping) tool that provides type-safe database access."
      }
    ],
    // Step 2: Product Listings
    [
      {
        question: "Which Tailwind class creates a responsive grid?",
        options: [
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          "flex flex-wrap",
          "block md:inline",
          "table"
        ],
        correctIndex: 0,
        explanation: "grid with responsive modifiers creates columns that change at different breakpoints."
      }
    ]
    // Add more for other steps...
  ];
  
  // Update questions
  for (let stepIndex = 0; stepIndex < ecommerce.steps.length; stepIndex++) {
    const step = ecommerce.steps[stepIndex];
    const questions = stepQuestions[stepIndex] || [];
    
    // Delete existing questions for this step
    await prisma.quizQuestion.deleteMany({
      where: { stepId: step.id }
    });
    
    // Add new questions
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      const q = questions[qIndex];
      await prisma.quizQuestion.create({
        data: {
          stepId: step.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          order: qIndex + 1,
          difficulty: "medium"
        }
      });
    }
    
    if (questions.length > 0) {
      console.log(`✅ Step ${step.order}: Updated ${questions.length} questions`);
    }
  }
  
  console.log("\n🎯 Quiz questions updated with real tutorial content!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
