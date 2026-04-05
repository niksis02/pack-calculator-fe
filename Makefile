.PHONY: install dev build test lint format docker-build

IMAGE            ?= pack-calculator-frontend
VITE_API_BASE_URL ?= /api/v1

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

docker-build:
	docker build --build-arg VITE_API_BASE_URL=$(VITE_API_BASE_URL) -t $(IMAGE) .
