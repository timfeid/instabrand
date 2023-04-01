export $(cat .env.test | xargs)
yarn prisma migrate dev
yarn prisma db seed
