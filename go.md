go env
go version
go tool compile -S filename.go  // 汇编

#以下两种命令都可以
go tool compile -S main.go
go build -gcflags -S main.go