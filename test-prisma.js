const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('Prisma client keys:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
console.log('Has legalEntityMaster?', 'legalEntityMaster' in prisma);
console.log('Has trialBalance?', 'trialBalance' in prisma);

prisma.$disconnect();

