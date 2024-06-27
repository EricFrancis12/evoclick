FROM golang:1.22-alpine AS builder

WORKDIR /build
COPY go.mod .
RUN go mod download
# TODO: Optimize COPY command so that only necessary files are copied
COPY . .
RUN go build -o ./output/bin

FROM gcr.io/distroless/base-debian12

WORKDIR /app
COPY --from=builder /build/output/ .
EXPOSE 3001
CMD ["/app/bin"]