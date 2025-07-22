
import aiohttp
from typing import List, Dict, Optional, Any
from util.tca import tc_request_sse
import json
import logging

class CoreCompletion:
    def __init__(
        self,
        model: str = "deepseek-v3-0324",
        system_prompt: Optional[str] = None,
        max_history: int = 10,
        timeout: int = 30,
    ):
        """
        异步对话接口封装类
        
        参数:
            model: 使用的模型名称
            system_prompt: 系统提示语
            max_history: 最大历史对话记录数
            timeout: 请求超时时间(秒)
        """
        self.model = model
        self.timeout = timeout
        self.max_history = max_history
        
        # 初始化对话历史
        self.conversation_history: List[Dict[str, str]] = []
        if system_prompt:
            self.conversation_history.append({
                "Role": "system",
                "Content": system_prompt
            })
    
    async def chat(self, query: str):
        """
        异步发送对话请求并获取回复
        
        参数:
            query: 用户输入的对话内容
            
        返回:
            模型生成的回复内容
        """
        # 添加用户消息到历史记录
        self.conversation_history.append({
            "Role": "user",
            "Content": query
        })
        
        # 确保历史记录不超过最大限制
        if len(self.conversation_history) > self.max_history * 2 + 1:  # 乘以2因为每条对话有user和assistant两条记录
            # 保留系统提示(如果有)和最近的对话
            if self.conversation_history[0]["Role"] == "system":
                self.conversation_history = [
                    self.conversation_history[0],
                    *self.conversation_history[-self.max_history * 2 :]
                ]
            else:
                self.conversation_history = self.conversation_history[-self.max_history * 2 :]
        
        try:
            # 构造请求数据
            action = "ChatCompletions"
            payload = {
                "Model": self.model,
                "Messages": self.conversation_history,
                "Stream": True,
            }
            assistant_reply = ''
            async for data in tc_request_sse(action, payload, service = "lkeap"):
                try:
                    message = json.loads(data)
                except:
                    logging.info(f'failed to parse {message}')
                if "Response" in message and "Error" in message["Response"]:
                    raise Exception(message["Response"]["Error"]["Message"])
                # 提取模型回复
                assistant_reply += message["Choices"][0]["Delta"]["Content"]
                # yield message
            
            # 添加助手回复到历史记录
            self.conversation_history.append({
                "Role": "assistant",
                "Content": assistant_reply
            })
            
            return assistant_reply
                
        except Exception as e:
            # 发生错误时移除最后添加的用户消息
            self.conversation_history.pop()
            raise e
    
    def get_conversation_history(self) -> List[Dict[str, str]]:
        """获取当前对话历史记录"""
        return self.conversation_history.copy()
    
    def clear_history(self) -> None:
        """清空对话历史(保留系统提示)"""
        if self.conversation_history and self.conversation_history[0]["role"] == "system":
            self.conversation_history = [self.conversation_history[0]]
        else:
            self.conversation_history = []
    