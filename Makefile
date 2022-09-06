.PHONY: build-RuntimeDependenciesLayer
.PHONY: build-SwaggerFunction
.PHONY: build-SessionsFunction
.PHONY: build-UsersFunction

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json"
	cp ".env.$(NODE_ENV)" "$(ARTIFACTS_DIR)/nodejs/.env.$(NODE_ENV)"
	cp -r "locales" "$(ARTIFACTS_DIR)/nodejs/locales"
	npm install -g @nestjs/cli
	npm install

build-lambda-common:
	rm -rf dist
	nest build $(ENTITY)
	cp -r dist "$(ARTIFACTS_DIR)/"

build-SwaggerFunction:
	$(MAKE) HANDLER=apps/swagger/src/main.ts ENTITY=swagger build-lambda-common

build-SessionsFunction:
	$(MAKE) HANDLER=apps/sessions/src/main.ts ENTITY=sessions build-lambda-common

build-UsersFunction:
	$(MAKE) HANDLER=apps/users/src/main.ts ENTITY=users build-lambda-common
