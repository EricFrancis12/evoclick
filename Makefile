migrate:
	npx prisma migrate dev

seed:
	npx prisma db seed

db push:
	npx prisma db push

dev api:
	go run main.go dev
