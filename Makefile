migrate:
	npx prisma migrate dev --name init

seed:
	npx prisma db seed

db push:
	npm prisma db push