🎯 Summary by Category:
Category Technology Purpose
Framework Express.js Web server
Language TypeScript Type safety
Database Prisma + PostgreSQL Data access
Password bcrypt Hashing
Auth jsonwebtoken JWT tokens
Validation zod Input validation
Config dotenv Environment vars
CORS cors Cross-origin requests
Dev Tool tsx Run TS in dev
Build Tool tsc (TypeScript) Compile TS → JS

services/auth/
└── src/
├── server.ts # Entry point
├── app.ts # Express app setup
├── routes/ # API routes
│ └── auth.routes.ts
├── controllers/ # Business logic
│ └── auth.controller.ts
├── middleware/ # Custom middleware
│ └── auth.middleware.ts
├── services/ # Service layer
│ └── auth.service.ts
├── utils/ # Helper functions
│ ├── jwt.ts
│ └── password.ts
└── types/ # TypeScript types
└── index.ts
