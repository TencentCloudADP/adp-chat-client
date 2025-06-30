.PHONY: client server docs deploy

# host  := 9.135.142.234
# path  := /opt/agent
# login := root
# port  := 36000
# host_remote  := 124.223.11.40
# login_remote := ubuntu
# port_remote  := 22
host  := 124.223.11.40
path  := /opt/agent
login := ubuntu
port  := 22

up:
	rsync -avrL -e 'ssh -p $(port)' --exclude="research" --exclude="node_modules" --exclude=".venv" --exclude=".git" --exclude=".next" --exclude="__pycache__" --exclude=".ipynb_checkpoints" --exclude=".DS_Store" ./server ./client ./deploy ./docker Makefile $(login)@$(host):$(path)
	# ssh -p $(port) $(login)@$(host) "cd $(path)/server/task; rm config.py; ln -s config.$(config).py config.py"

# ----------------- client -----------------

init_client:
	cd client/tagentic-client-vue && npm install

client:
	cd client/tagentic-client-vue && npm run build

init_server:
	cd server; python3 -m venv server/.venv
	source server/.venv/bin/activate; cd server; pip install -r requirements.txt

requirements:
	source server/.venv/bin/activate; cd server; pip freeze > requirements.txt

run:
	source server/.venv/bin/activate; cd server; sanic main:create_app --factory -H 0.0.0.0 -p 8000

test_server:
	source server/.venv/bin/activate; cd server; pytest test/unit_test -W ignore::DeprecationWarning

# ----------------- db -----------------

init_db:
	source server/.venv/bin/activate; cd server; sanic main:create_migrations_app --factory

db:
	ssh -p $(port) $(login)@$(host) "docker rm -f pgsql-dev"
	ssh -p $(port) $(login)@$(host) "docker run --name pgsql-dev -d -e POSTGRES_PASSWORD=ye823hd8euhwf -p 127.0.0.1:5432:5432 -v /data/postgres:/var/lib/postgresql/data postgres"
	ssh -p $(port) $(login)@$(host) "docker ps"


# ----------------- pack -----------------

pack:
	docker build -t tagentic-system-client -f docker/Dockerfile .

push_image:
	docker tag tagentic-system-client mirrors.tencent.com/ti-machine-learning/tagentic-system-client:0.0.1
	docker push mirrors.tencent.com/ti-machine-learning/tagentic-system-client:0.0.1

dump_image:
	docker save -o /tmp/tagentic-system-client.tar tagentic-system-client

send_image:
	scp -3 scp://$(login)@$(host):$(port)//tmp/tagentic-system-client.tar scp://$(login_remote)@$(host_remote):$(port_remote)//tmp/tagentic-system-client.tar

load_image:
	docker load -i /tmp/tagentic-system-client.tar

# ----------------- deploy -----------------

stop_deploy:
	-docker rm -f tagentic-db
	-docker rm -f tagentic-server
	-docker network rm tagentic-network

deploy: stop_deploy
	docker network create tagentic-network
	cd deploy; docker run --name tagentic-db -d -e POSTGRES_PASSWORD=ye823hd8euhwf -v ./volume/db:/var/lib/postgresql/data --network tagentic-network postgres
	cd deploy; docker run --name tagentic-server -d -p 80:8000 -v ./.env:/app/.env --network tagentic-network tagentic-system-client

init_env:
	sudo bash deploy/init_env.sh