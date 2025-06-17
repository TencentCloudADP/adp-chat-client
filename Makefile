.PHONY: client server docs

host  := 9.135.142.234
path  := /opt/agent
login := root
port  := 36000

up:
	rsync -avrL -e 'ssh -p $(port)' --exclude="research" --exclude="node_modules" --exclude=".git" --exclude=".next" --exclude="__pycache__" --exclude=".ipynb_checkpoints" --exclude=".DS_Store" ./server ./client Makefile $(login)@$(host):$(path)
	# ssh -p $(port) $(login)@$(host) "cd $(path)/server/task; rm config.py; ln -s config.$(config).py config.py"

# ----------------- client -----------------

init_client:
	cd client/tagentic-client-vue && npm install

client:
	cd client/tagentic-client-vue && npm run build

# ----------------- server -----------------

init_server:
	cd server; python3 -m venv server/.venv
	source server/.venv/bin/activate; cd server; pip install -r requirements.txt

requirements:
	source server/.venv/bin/activate; cd server; pip freeze > requirements.txt

run:
	source server/.venv/bin/activate; cd server; sanic main:create_app --factory

test_server:
	source server/.venv/bin/activate; cd server; pytest test/unit_test -W ignore::DeprecationWarning

# ----------------- db -----------------

init_db:
	source server/.venv/bin/activate; cd server; sanic main:create_migrations_app --factory

db:
	ssh -p $(port) $(login)@$(host) "docker rm -f pgsql-dev"
	ssh -p $(port) $(login)@$(host) "docker run --name pgsql-dev -d -e POSTGRES_PASSWORD=ye823hd8euhwf -p 127.0.0.1:5432:5432 -v /data/postgres:/var/lib/postgresql/data postgres"
	ssh -p $(port) $(login)@$(host) "docker ps"
