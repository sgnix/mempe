DIR=~/mempe

help:
	@echo "help    this help"
	@echo "start   run the socket server"

start:
	forever start -o $(DIR)/log/event.log -e $(DIR)/log/error.log $(DIR)/scripts/socket-server.js
