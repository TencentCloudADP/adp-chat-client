from app_factory import create_app

if __name__ == '__main__':
    # Example usage:
    # get customer account login url:
    #   python main.py --generate-customer-account-url --uid 1 --username test

    async def add_user(args):
        from core.account import CoreAccount
        from util.database import create_db_engine

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
        print(f'{GREEN}{url}{RESET}')

    app = create_app()
    import asyncio
    import argparse
    parse = argparse.ArgumentParser()
    parse.add_argument('--add-user', action='store_true')
    parse.add_argument('-u', type=str)
    parse.add_argument('-p', type=str)
    parse.add_argument('--generate-customer-account-url', action='store_true')
    parse.add_argument('--uid', type=str)
    parse.add_argument('--username', type=str)
    args, _ = parse.parse_known_args()
    # print(f'args: {args}')
    if args.add_user:
        asyncio.run(add_user(args))
        exit(0)
    if args.generate_customer_account_url:
        generate_customer_account_url(args)
        exit(0)
