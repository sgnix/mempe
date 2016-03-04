
help:
	@echo "help    this help"
	@echo "start   run the socket server"

start:
	forever start -o log/event.log -e log/error.log scripts/socket-server.js
