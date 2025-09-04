.PHONY: client server docs deploy build

-include Makefile.local

# ----------------- client -----------------

init_client:
	cd client && npm install

client:
	cd client/tagentic-client-vue && npm run build

test_client:
	cd client && npm run test --ws

# ----------------- server -----------------

init_server:
	cd server; python3 -m venv server/.venv
	source server/.venv/bin/activate; cd server; pip install -r requirements.txt

requirements:
	source server/.venv/bin/activate; cd server; pip freeze > requirements.txt

run:
	source server/.venv/bin/activate; cd server; sanic main:create_app --factory -H 0.0.0.0 -p 8000

test_server:
	source server/.venv/bin/activate; cd server; pytest test/unit_test -W ignore::DeprecationWarning

# ----------------- pack -----------------

build_server:
	-mkdir build
	rsync -avr --exclude='__pycache__' --exclude='.*' server/ build/server/

build_client:
	-mkdir build
	rsync -avr --exclude='node_modules' --exclude='.*' client/ build/client/
	docker run -v ./build:/build/ -w /build node:22-bullseye-slim sh -c "cd client && npm i && npm run build"

build:
	-mkdir build
	make build_client
	make build_server

clean:
	rm -rf build

pack: build
	-mkdir build/docker
	# 通过rsync -L把符号链接替换为实际文件
	rsync -avL --exclude='__pycache__' --exclude='.*' build/server/ build/docker/server/
	cd build && docker build -t adp-chat-client -f ../docker/Dockerfile .

push_image:
	docker tag adp-chat-client mirrors.tencent.com/ti-machine-learning/adp-chat-client:0.0.2
	docker push mirrors.tencent.com/ti-machine-learning/adp-chat-client:0.0.2

pull_image:
	docker pull mirrors.tencent.com/ti-machine-learning/adp-chat-client:0.0.2

# ----------------- deploy -----------------

stop:
	@bash script/deploy.sh stop

debug:
	@bash script/deploy.sh debug

deploy:
	@bash script/deploy.sh deploy

login:
	@bash script/deploy.sh login

logs:
	@bash script/deploy.sh logs

init_env:
	sudo bash script/init_env.sh