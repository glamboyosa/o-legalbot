.PHONY: deploy start

start:
	bun src/index.ts &

# Run the app first, then deploy
deploy: start
	npx trigger.dev@latest deploy && fly deploy