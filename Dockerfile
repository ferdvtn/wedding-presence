FROM golang:1.20-alpine

WORKDIR /app

COPY . .

RUN env GOOS=linux GOARCH=amd64 go build -o wedding_presence ./main.go

EXPOSE 1323

CMD [ "/app/wedding_presence" ]