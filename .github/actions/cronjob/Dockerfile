FROM golang:1.20-alpine as builder
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY main.go go.mod go.sum /app/

RUN go version

RUN go get -d -v

RUN CGO_ENABLED=0 go build -o main main.go

# Make a small image
FROM scratch

# # Copy the ca-certificate.crt from the build stage.
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/main /main
CMD ["/main"]
