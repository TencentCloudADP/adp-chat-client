from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from model.agent import AgentConfig


class CoreAgent:
    @staticmethod
    async def get(
        db: AsyncSession, account_id: str, application_id: str
    ) -> Optional[AgentConfig]:
        """根据 AccountId + ApplicationId 查询该用户在该应用下的 agent 配置"""
        record = (
            await db.execute(
                select(AgentConfig)
                .where(
                    AgentConfig.AccountId == account_id,
                    AgentConfig.ApplicationId == application_id,
                )
                .limit(1)
            )
        ).scalar()
        return record

    @staticmethod
    async def upsert(
        db: AsyncSession, account_id: str, application_id: str, agent_id: str
    ) -> AgentConfig:
        """新增或更新指定用户在指定应用下的 agent_id"""
        record = await CoreAgent.get(db, account_id, application_id)
        if record is None:
            record = AgentConfig(
                AccountId=account_id,
                ApplicationId=application_id,
                AgentId=agent_id,
            )
            db.add(record)
        else:
            record.AgentId = agent_id
        await db.commit()
        return record

    @staticmethod
    async def delete(db: AsyncSession, account_id: str, application_id: str) -> None:
        """删除指定用户在指定应用下的 agent 配置"""
        record = await CoreAgent.get(db, account_id, application_id)
        if record is None:
            return
        await db.delete(record)
        await db.commit()
