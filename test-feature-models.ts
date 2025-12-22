import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Verifying Prisma Models...')

    // Check if models exist on the client instance
    // Note: We are not connecting to DB, just checking object shape effectively or relying on TS compilation if this were TS, 
    // but since we run with tsx, valid ref is enough.

    const models = [
        'product',
        'todo',
        'weatherLocation',
        'socialPost',
        'socialComment',
        'recipe',
        'portfolioItem'
    ]

    const missing = []

    for (const model of models) {
        if (!(model in prisma)) {
            console.error(`❌ Model '${model}' NOT found in PrismaClient`)
            missing.push(model)
        } else {
            console.log(`✅ Model '${model}' found`)
        }
    }

    if (missing.length > 0) {
        console.error('Verification FAILED')
        process.exit(1)
    }

    // Also verify Stripe is importable
    try {
        const stripe = require('stripe')
        console.log('✅ Stripe package found')
    } catch (e) {
        console.error('❌ Stripe package NOT found')
        process.exit(1)
    }

    console.log('Verification PASSED')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
