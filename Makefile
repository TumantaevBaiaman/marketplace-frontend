.DEFAULT_GOAL := help

# ──────────────────────────────────────────────────────────────
#  Help
# ──────────────────────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "  Usage: make <target>"
	@echo ""
	@echo "  Dev"
	@echo "    install        Install dependencies"
	@echo "    dev            Start dev server"
	@echo "    preview        Preview production build"
	@echo ""
	@echo "  Code quality"
	@echo "    lint           Run ESLint"
	@echo "    lint-fix       Run ESLint with auto-fix"
	@echo "    format         Format code with Prettier"
	@echo "    format-check   Check formatting without changes"
	@echo "    typecheck      TypeScript check"
	@echo "    check          lint + format-check + typecheck"
	@echo ""
	@echo "  Tests"
	@echo "    test           Run unit tests"
	@echo "    test-watch     Run unit tests in watch mode"
	@echo "    test-coverage  Run unit tests with coverage"
	@echo "    e2e            Run E2E tests (Playwright)"
	@echo "    e2e-ui         Run E2E tests with Playwright UI"
	@echo ""
	@echo "  Build"
	@echo "    build          Production build"
	@echo "    clean          Remove build artifacts"
	@echo ""
	@echo "  CI"
	@echo "    ci             Full CI pipeline (check + test + build)"
	@echo ""

# ──────────────────────────────────────────────────────────────
#  Dev
# ──────────────────────────────────────────────────────────────
.PHONY: install
install:
	npm ci

.PHONY: dev
dev:
	npm run dev

.PHONY: preview
preview:
	npm run preview

# ──────────────────────────────────────────────────────────────
#  Code quality
# ──────────────────────────────────────────────────────────────
.PHONY: lint
lint:
	npm run lint

.PHONY: lint-fix
lint-fix:
	npm run lint:fix

.PHONY: format
format:
	npm run format

.PHONY: format-check
format-check:
	npm run format:check

.PHONY: typecheck
typecheck:
	npm run typecheck

.PHONY: check
check: lint format-check typecheck

# ──────────────────────────────────────────────────────────────
#  Tests
# ──────────────────────────────────────────────────────────────
.PHONY: test
test:
	npm run test

.PHONY: test-watch
test-watch:
	npm run test:watch

.PHONY: test-coverage
test-coverage:
	npm run test:coverage

.PHONY: e2e
e2e:
	npm run test:e2e

.PHONY: e2e-ui
e2e-ui:
	npm run test:e2e:ui

# ──────────────────────────────────────────────────────────────
#  Build
# ──────────────────────────────────────────────────────────────
.PHONY: build
build:
	npm run build

.PHONY: clean
clean:
	rm -rf dist coverage playwright-report

# ──────────────────────────────────────────────────────────────
#  CI
# ──────────────────────────────────────────────────────────────
.PHONY: ci
ci: check test build
