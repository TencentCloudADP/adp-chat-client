#!/bin/bash

# 定义实例目录
INSTANCE_DIR="deploy"

### 封装实例选择逻辑，返回选中的实例名
select_instance() {
    # 检查实例目录是否存在
    if [ ! -d "$INSTANCE_DIR" ]; then
        echo "Error: '$INSTANCE_DIR' directory not found!" >&2
        exit 1
    fi

    # 获取所有实例
    INSTANCES=($(ls -d "$INSTANCE_DIR"/*/ | sed "s|$INSTANCE_DIR/||g" | sed "s|/||g"))

    # 如果没有实例，退出
    if [ ${#INSTANCES[@]} -eq 0 ]; then
        echo "No deployment found in '$INSTANCE_DIR'!" >&2
        exit 1
    fi

    # 显示实例列表
    echo "Available deployments:"
    for i in "${!INSTANCES[@]}"; do
        echo "$((i+1)). ${INSTANCES[$i]}"
    done

    # 让用户选择实例
    read -p "Enter the number of the deployment: " INSTANCE_NUM
    if [[ ! "$INSTANCE_NUM" =~ ^[0-9]+$ ]] || [ "$INSTANCE_NUM" -lt 1 ] || [ "$INSTANCE_NUM" -gt "${#INSTANCES[@]}" ]; then
        echo "Invalid deployment number!" >&2
        exit 1
    fi

    # 返回选中的实例名
    INSTANCE="${INSTANCES[$((INSTANCE_NUM-1))]}"
}

### 封装 stop 逻辑
stop_instance() {
    local INSTANCE="$1"
    echo "Stopping $INSTANCE..."
	docker rm -f tagentic-db-$INSTANCE
	docker rm -f tagentic-server-$INSTANCE
	docker network rm tagentic-network-$INSTANCE
}

### 封装 deploy 逻辑
deploy_instance() {
    local INSTANCE="$1"
    echo "Deploying $INSTANCE..."
    cd $INSTANCE_DIR/$INSTANCE
    source .env
    docker network create tagentic-network-$INSTANCE
    docker run --name tagentic-db-$INSTANCE -d -e POSTGRES_PASSWORD=$PGSQL_PASSWORD -v ./volume/db:/var/lib/postgresql/data --network tagentic-network-$INSTANCE postgres
    docker run --name tagentic-server-$INSTANCE -d -p $SERVER_HTTP_PORT:8000 -v ./.env:/app/.env --network tagentic-network-$INSTANCE tagentic-system-client
}

### 封装 debug 逻辑
debug_instance() {
    local INSTANCE="$1"
    echo "Deploying $INSTANCE..."
    cd $INSTANCE_DIR/$INSTANCE
    source .env
    docker network create tagentic-network-$INSTANCE
    docker run --name tagentic-db-$INSTANCE -d -e POSTGRES_PASSWORD=$PGSQL_PASSWORD -v ./volume/db:/var/lib/postgresql/data --network tagentic-network-$INSTANCE postgres
    cd -

	cp $INSTANCE_DIR/$INSTANCE/.env server/
	docker run --name tagentic-server-$INSTANCE -d -p $SERVER_HTTP_PORT:8000 -v ./server/:/app/ --network tagentic-network-$INSTANCE tagentic-system-client
}

### 封装 login 逻辑
login() {
    local INSTANCE="$1"
	docker exec -it tagentic-server-$INSTANCE bash
}

### 封装 logs 逻辑
show_logs() {
    local INSTANCE="$1"
    docker logs tagentic-server-$INSTANCE
}

### 主逻辑
main() {
    # 选择实例
    select_instance
    if [ -z "$INSTANCE" ]; then
        exit 1
    fi

    echo "Selected deployment: $INSTANCE"

    # 根据参数执行操作
    case "$1" in
        "debug")
            stop_instance "$INSTANCE"
            debug_instance "$INSTANCE"
            ;;
        "deploy")
            stop_instance "$INSTANCE"
            deploy_instance "$INSTANCE"
            ;;
        "stop")
            stop_instance "$INSTANCE"
            ;;
        "login")
            login "$INSTANCE"
            ;;
        "logs")
            show_logs "$INSTANCE"
            ;;
        *)
            echo "Usage: $0 [deploy|debug|stop|login|logs]"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"