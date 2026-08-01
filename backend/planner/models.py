"""
Daily Planner / Todo List Model
"""

from django.db import models
from django.conf import settings


class TodoCategory(models.Model):
    """Task categories like Must Do, Study, Health, etc."""
    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='📌')
    color = models.CharField(max_length=20, default='#FF6B6B')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='todo_categories')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'todo_categories'
        ordering = ['order']
        unique_together = ['name', 'user']

    def __str__(self):
        return f"{self.emoji} {self.name}"


class Todo(models.Model):
    """Individual task item"""
    PRIORITY_CHOICES = [
        ('high', '🔴 High'),
        ('medium', '🟡 Medium'),
        ('low', '🟢 Low'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='todos')
    category = models.ForeignKey(TodoCategory, on_delete=models.SET_NULL, null=True, blank=True)
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, default='📝')
    
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    duration = models.IntegerField(help_text='Duration in minutes', default=30)
    
    completed = models.BooleanField(default=False)
    completion_percentage = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    
    is_recurring = models.BooleanField(default=False)
    recurring_type = models.CharField(max_length=20, blank=True, 
                                      choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'todos'
        ordering = ['date', 'order']

    def __str__(self):
        return f"{self.emoji} {self.title}"

    def save(self, *args, **kwargs):
        if self.completed:
            self.completion_percentage = 100
            self.status = 'completed'
        super().save(*args, **kwargs)