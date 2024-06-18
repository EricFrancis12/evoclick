migrate:
	npx prisma migrate dev

seed:
	npx prisma db seed

db push:
	npx prisma db push

api build:
	npm run api_build

dev api: api build
	go run dev.api.server.go

