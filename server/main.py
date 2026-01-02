import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


if __name__ == '__main__':
    # Example usage:
    # get customer account login url:
    #   python main.py --generate-customer-account-url --uid 1 --username test

    def check_secret_key(env_file: str = '.env'):
        # 检查SECRET_KEY如果为空，则生成一个随机的密钥
        import os
        import uuid
        # 检查文件是否存在
        if not os.path.exists(env_file):
            raise FileNotFoundError(f"环境文件 {env_file} 不存在")

        # 读取文件内容
        with open(env_file, 'r') as f:
            lines = f.readlines()

        # 检查是否需要修改
        modified = False
        for i, line in enumerate(lines):
            if line.strip() == 'SECRET_KEY=':
                new_key = str(uuid.uuid4())
                lines[i] = f'SECRET_KEY={new_key}\n'
                modified = True

        # 如果需要修改则写入文件
        if modified:
            with open(env_file, 'w') as f:
                f.writelines(lines)
            logger.info(f"已生成新的SECRET_KEY并更新到 {env_file}")

    async def add_user(args):
        from app_factory import create_app
        from core.account import CoreAccount
        from util.database import create_db_engine

        app = create_app()
        _, sessionmaker = create_db_engine(app)
        db = sessionmaker()
        await CoreAccount.create_account(db, email=args.u, password=args.p)
        await db.close()

    def generate_customer_account_url(args):
        import time
        import hmac
        import hashlib
        from config import tagentic_config
        GREEN = '\033[32m'  # pylint: disable=invalid-name
        RESET = '\033[0m'   # pylint: disable=invalid-name

        customer_id = args.uid
        name = args.username
        extra_info = ''
        timestamp = int(time.time())

        msg = f'{customer_id}{name}{extra_info}{timestamp}'
        sign = hmac.new(
            tagentic_config.CUSTOMER_ACCOUNT_SECRET_KEY.encode("utf-8"),
            msg.encode("utf-8"), hashlib.sha256
        ).hexdigest()

        url = '{}/account/customer?CustomerId={}&Name={}&Timestamp={}&ExtraInfo=&Code={}'.format(
            tagentic_config.SERVICE_API_URL,
            args.uid,
            args.username,
            int(time.time()),
            sign
        )
        logger.info(f'{GREEN}{url}{RESET}')

    import asyncio
    import argparse
    parse = argparse.ArgumentParser()
    parse.add_argument('--check-secret-key', action='store_true')
    parse.add_argument('--add-user', action='store_true')
    parse.add_argument('-u', type=str)
    parse.add_argument('-p', type=str)
    parse.add_argument('--generate-customer-account-url', action='store_true')
    parse.add_argument('--uid', type=str)
    parse.add_argument('--username', type=str)
    args, _ = parse.parse_known_args()
    # logger.info(f'args: {args}')
    if args.check_secret_key:
        check_secret_key()
    elif args.add_user:
        asyncio.run(add_user(args))
    elif args.generate_customer_account_url:
        generate_customer_account_url(args)
