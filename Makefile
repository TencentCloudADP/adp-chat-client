.PHONY: client server docs deploy

-include Makefile.local
# 运行环境信息放在自己的Makefile.local文件
# host      := x.x.x.x
# path      := /opt/agent/
# login     := root
# port      := 36000

up:
	rsync -avrL -e 'ssh -p $(port)' --exclude="research" --exclude="node_modules" --exclude=".venv" --exclude=".git" --exclude=".next" --exclude="__pycache__" --exclude=".ipynb_checkpoints" --exclude=".DS_Store" ./server ./script ./client ./deploy ./docker Makefile $(login)@$(host):$(path)
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

send_image:
	ssh -p $(port) $(login)@$(host) "sudo docker save -o /tmp/tagentic-system-client.tar tagentic-system-client"
	scp -3 scp://$(login)@$(host):$(port)//tmp/tagentic-system-client.tar scp://$(login_remote)@$(host_remote):$(port_remote)//tmp/tagentic-system-client.tar
	ssh -p $(port_remote) $(login_remote)@$(host_remote) "sudo docker load -i /tmp/tagentic-system-client.tar"

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