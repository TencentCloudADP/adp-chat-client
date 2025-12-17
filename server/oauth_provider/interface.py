from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from model.account import Account


class BaseOAuthProvider():
    """OAuthProvider基类，实现具体的厂商接口需要从该类继承
    """

    @classmethod
    def get_name(cls) -> str:
        """获取OAuthProvider标识
        Returns:
            str: 例如："github"
        """
        raise NotImplementedError("Subclasses must implement this method")

    async def callback(
        self,
        db: AsyncSession,
        provider: str,
        code: Optional[str]
    ) -> Account:
        """回调响应
        响应授权回调，验证合法性，查找本系统对应账户的，如果不存在需要创建账户
        Returns:
            Account: 本系统账户
        """
        raise NotImplementedError("Subclasses must implement this method")
