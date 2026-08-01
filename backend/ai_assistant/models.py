"""
AI Assistant Model - Chat history and AI interactions
"""

from django.db import models
from django.conf import settings


class ChatMessage(models.Model):
    """AI chat message history"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('assistant', 'Assistant')])
    message = models.TextField()
    
    context_data = models.JSONField(null=True, blank=True, help_text='User data context for AI')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.role}: {self.message[:50]}..."