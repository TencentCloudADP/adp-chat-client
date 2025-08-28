.PHONY: client server docs deploy

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

pack:
	rm -rf build
	mkdir build
	rsync -avL --exclude='__pycache__' --exclude='.*' server/ build/server/

	cd build && docker build -t tagentic-system-client -f ../docker/Dockerfile .

	rm -rf build

push_image:
	docker tag tagentic-system-client mirrors.tencent.com/ti-machine-learning/tagentic-system-client:0.0.2
	docker push mirrors.tencent.com/ti-machine-learning/tagentic-system-client:0.0.2

pull_image:
	docker pull mirrors.tencent.com/ti-machine-learning/tagentic-system-client:0.0.2

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