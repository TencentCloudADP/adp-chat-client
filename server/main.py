from app_factory import create_app

if __name__ == '__main__':
    async def add_user(args):
        from core.account import CoreAccount
        from util.database import create_db_engine

        _, sessionmaker = create_db_engine(app)
        db = sessionmaker()
        await CoreAccount.create_account(db, email=args.u, password=args.p)
        await db.close()

    app = create_app()
    import asyncio
    import argparse
    parse = argparse.ArgumentParser()
    parse.add_argument('--add-user', action='store_true')
    parse.add_argument('-u', type=str)
    parse.add_argument('-p', type=str)
    args, _ = parse.parse_known_args()
    print(args)
    if args.add_user:
        asyncio.run(add_user(args))
        exit(0)
