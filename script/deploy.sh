#!/bin/bash

# 定义实例目录
INSTANCE_DIR="deploy"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEV_DB_CONTAINER="adp-chat-client-dev-db"
DEV_DB_DATA_DIR="$ROOT_DIR/deploy/dev/volume/db"

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
	docker rm -f adp-chat-client-db-$INSTANCE
	docker rm -f adp-chat-client-$INSTANCE
	docker network rm adp-chat-client-network-$INSTANCE
}

# 检查.env文件是否存在
check_env() {
    if [ ! -f ".env" ]; then
        echo "错误: 未找到.env文件: `pwd`"
        echo "Error: .env file not found: `pwd`"
        exit 1
    fi
}

check_dev_env() {
    if [ ! -f "$ROOT_DIR/server/.env" ]; then
        echo "错误: 未找到 server/.env: $ROOT_DIR/server/.env"
        echo "Error: server/.env file not found: $ROOT_DIR/server/.env"
        exit 1
    fi
}

load_dev_env() {
    cd "$ROOT_DIR"
    check_dev_env
    set -a
    source server/.env
    set +a
}

validate_dev_db_env() {
    if [ "$PGSQL_HOST" != "localhost" ] && [ "$PGSQL_HOST" != "127.0.0.1" ]; then
        echo "dev_withdb requires PGSQL_HOST to be localhost or 127.0.0.1 in server/.env" >&2
        exit 1
    fi
}

ensure_dev_db_data_dir() {
    mkdir -p "$DEV_DB_DATA_DIR"
}

### 封装 deploy 逻辑
deploy_instance() {
    local INSTANCE="$1"
    echo "Deploying $INSTANCE..."
    cd $INSTANCE_DIR/$INSTANCE
    check_env
    source .env
    docker network create adp-chat-client-network-$INSTANCE
    docker run --name adp-chat-client-db-$INSTANCE -d --restart=unless-stopped -e POSTGRES_PASSWORD=$PGSQL_PASSWORD -v ./volume/db:/var/lib/postgresql/data --network adp-chat-client-network-$INSTANCE postgres:17
    docker run --name adp-chat-client-$INSTANCE -d --restart=unless-stopped -p $SERVER_HTTP_PORT:8000 --mount type=bind,source=./.env,target=/app/.env --network adp-chat-client-network-$INSTANCE adp-chat-client
}

### 封装 debug 逻辑
debug_instance() {
    local INSTANCE="$1"
    echo "Deploying $INSTANCE..."
    cd $INSTANCE_DIR/$INSTANCE
    check_env
    source .env
    docker network create adp-chat-client-network-$INSTANCE
    docker run --name adp-chat-client-db-$INSTANCE -d -e POSTGRES_PASSWORD=$PGSQL_PASSWORD -v ./volume/db:/var/lib/postgresql/data --network adp-chat-client-network-$INSTANCE postgres:17
    cd -

	cp $INSTANCE_DIR/$INSTANCE/.env server/
	docker run --name adp-chat-client-$INSTANCE -d -p $SERVER_HTTP_PORT:8000 -v ./server/:/app/ -v ./client/:/client/ --network adp-chat-client-network-$INSTANCE adp-chat-client
}

### 封装 login 逻辑
login() {
    local INSTANCE="$1"
	docker exec -it adp-chat-client-$INSTANCE bash
}

### 封装 run 逻辑
run() {
    local INSTANCE="$1"
    local CMD="$2"
	docker exec -it adp-chat-client-$INSTANCE bash -c "LOG_LEVEL=WARN $(printf '%q ' $CMD)"
}

### 封装 logs 逻辑
show_logs() {
    local INSTANCE="$1"
    docker logs -f adp-chat-client-$INSTANCE
}

### 封装 dev_withdb 逻辑
run_dev_with_db() {
    local DB_PID=""
    local READY=0

    cleanup_dev_db() {
        if [ -n "$DB_PID" ] && kill -0 "$DB_PID" 2>/dev/null; then
            kill "$DB_PID" 2>/dev/null || true
            wait "$DB_PID" 2>/dev/null || true
        fi
    }

    handle_interrupt() {
        exit 130
    }

    trap cleanup_dev_db EXIT
    trap handle_interrupt INT TERM

    load_dev_env
    validate_dev_db_env
    ensure_dev_db_data_dir

    if docker ps --format '{{.Names}}' | grep -Fx "$DEV_DB_CONTAINER" >/dev/null 2>&1; then
        echo "dev db container '$DEV_DB_CONTAINER' is already running" >&2
        exit 1
    fi

    docker rm "$DEV_DB_CONTAINER" >/dev/null 2>&1 || true

    echo "Starting PostgreSQL in $DEV_DB_CONTAINER on localhost:$PGSQL_PORT"
    docker run --name "$DEV_DB_CONTAINER" --rm \
        -e POSTGRES_DB="$PGSQL_DB" \
        -e POSTGRES_USER="$PGSQL_USER" \
        -e POSTGRES_PASSWORD="$PGSQL_PASSWORD" \
        -v "$DEV_DB_DATA_DIR:/var/lib/postgresql/data" \
        -p "$PGSQL_PORT":5432 \
        postgres:17 &
    DB_PID=$!

    for _ in $(seq 1 30); do
        if docker exec "$DEV_DB_CONTAINER" pg_isready -U "$PGSQL_USER" -d "$PGSQL_DB" >/dev/null 2>&1; then
            READY=1
            break
        fi
        if ! kill -0 "$DB_PID" 2>/dev/null; then
            wait "$DB_PID"
            exit 1
        fi
        sleep 1
    done

    if [ "$READY" -ne 1 ]; then
        echo "PostgreSQL did not become ready within 30 seconds" >&2
        exit 1
    fi

    wait "$DB_PID"
}

wait_dev_db() {
    local READY=0

    load_dev_env
    validate_dev_db_env

    for _ in $(seq 1 30); do
        if docker exec "$DEV_DB_CONTAINER" pg_isready -U "$PGSQL_USER" -d "$PGSQL_DB" >/dev/null 2>&1; then
            READY=1
            break
        fi
        sleep 1
    done

    if [ "$READY" -ne 1 ]; then
        echo "PostgreSQL did not become ready within 30 seconds" >&2
        exit 1
    fi
}

### 主逻辑
main() {
    local ACTION="$1"
    shift || true

    case "$ACTION" in
        "dev_withdb"|"dev-withdb")
            run_dev_with_db
            return
            ;;
        "wait_devdb"|"wait-devdb")
            wait_dev_db
            return
            ;;
    esac

    local CMD="$*"

    # 选择实例
    select_instance
    if [ -z "$INSTANCE" ]; then
        exit 1
    fi

    echo "Selected deployment: $INSTANCE"

    # 根据参数执行操作
    case "$ACTION" in
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
        "run")
            run "$INSTANCE" "$CMD"
            ;;
        "logs")
            show_logs "$INSTANCE"
            ;;
        *)
            echo "Usage: $0 [deploy|debug|stop|login|logs|run|dev_withdb|wait_devdb]"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
