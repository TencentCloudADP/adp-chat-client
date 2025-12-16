from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.application import Application, SharedApplication
import json
from config import tagentic_config
import uuid


class CoreApplication:
    # 创建智能体应用
    @staticmethod
    async def create(db: AsyncSession, account_id: str, name: str, avatar: str, extra_info: dict) -> Application:
        application = Application(
            Vendor='Tencent',
            ApplicationId=f'{tagentic_config.BOT_BIZ_ID}:{uuid.uuid4()}',
            AppKey=tagentic_config.BOT_APP_KEY,
            CreatedBy=account_id,
            Avatar=avatar,
            Name=name,
            ExtraInfo=json.dumps(extra_info),
            Published=False
        )
        db.add(application)
        await db.commit()
        return application

    # 发布智能体应用（只能发布自己创建的智能体应用）
    @staticmethod
    async def publish(db: AsyncSession, application_id: str, account_id: str):
        application = (await db.execute(select(Application).where(
            Application.ApplicationId == application_id,
            Application.CreatedBy == account_id
        ).limit(1))).scalar()
        if application is None:
            raise Exception("application not found")
        application.Published = True
        await db.commit()

        # 自动分享给创建者
        await CoreApplication.share(db, application_id, account_id)

        return application

    # 取消发布智能体应用（只能取消发布自己创建的智能体应用）
    @staticmethod
    async def unpublish(db: AsyncSession, application_id: str, account_id: str):
        application = (await db.execute(select(Application).where(
            Application.ApplicationId == application_id,
            Application.CreatedBy == account_id
        ).limit(1))).scalar()
        if application is None:
            raise Exception("application not found")
        application.Published = False
        await db.commit()

        # 取消分享给创建者
        await CoreApplication.unshare(db, application_id, account_id)

        return application

    # 分享智能体应用给其他账号
    @staticmethod
    async def share(db: AsyncSession, application_id: str, account_id: str):
        shared = (await db.execute(select(SharedApplication).where(
            SharedApplication.ApplicationId == application_id,
            SharedApplication.SharedBy == account_id
        ).limit(1))).scalar()
        if shared is not None:
            return shared

        shared = SharedApplication(
            ApplicationId=application_id,
            SharedBy=account_id
        )
        db.add(shared)
        await db.commit()
        return shared

    # 取消分享智能体应用给其他账号
    @staticmethod
    async def unshare(db: AsyncSession, application_id: str, account_id: str):
        shared = (await db.execute(select(SharedApplication).where(
            SharedApplication.ApplicationId == application_id,
            SharedApplication.SharedBy == account_id
        ).limit(1))).scalar()
        if shared is None:
            raise Exception("shared not found")
        await db.delete(shared)
        await db.commit()
        return shared

    # 获取自己创建的智能体应用列表
    @staticmethod
    async def list(db: AsyncSession, account_id: str) -> List[Application]:
        print(f"list applications by account_id: {account_id}")
        applications = (await db.execute(select(Application).where(
            Application.CreatedBy == account_id
        ))).scalars()
        return applications

    # 获取已经发布的智能体应用列表
    @staticmethod
    async def list_published(db: AsyncSession) -> List[Application]:
        applications = (await db.execute(select(Application).where(
            Application.Published == True
        ))).scalars().all()
        return applications

    # 获取分享给其他账号的智能体应用列表
    @staticmethod
    async def list_shared(db: AsyncSession, account_id: str) -> List[Application]:
        # First get the ApplicationIds that are shared by this account
        shared_apps = (await db.execute(select(SharedApplication).where(
            SharedApplication.SharedBy == account_id
        ))).scalars().all()

        if not shared_apps:
            return []

        # Extract application IDs
        application_ids = [shared_app.ApplicationId for shared_app in shared_apps]

        # Then get the actual Application objects
        applications = (await db.execute(select(Application).where(
            Application.ApplicationId.in_(application_ids)
        ))).scalars().all()

        return applications

    # 获取智能体应用详情
    @staticmethod
    async def get(db: AsyncSession, application_id: str) -> Application:
        application = (await db.execute(select(Application).where(
            Application.ApplicationId == application_id
        ).limit(1))).scalar()
        if application is None:
            raise Exception("application not found")
        return application