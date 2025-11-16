import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrisma() {
  // TypeScript knows ALL your fields!
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      passwordHash: 'hashedpassword123',
      // TypeScript will autocomplete all fields!
      // Try typing "data." in VS Code and see the magic!
    }
  });

  console.log('Created user:', user);
  
  // TypeScript knows the return type!
  // Hover over `user` - it knows it's a User type with all fields
}

// This is just for demonstration
// Don't run it yet (it will try to create a user)

