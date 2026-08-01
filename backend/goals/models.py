"""
Goals Tracker Models - Daily, Weekly, Monthly, Yearly Goals
"""

from django.db import models
from django.conf import settings


class Goal(models.Model):
    """Goal tracking model"""
    PERIOD_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='goals')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, default='🎯')
    
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    deadline = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    progress_percentage = models.IntegerField(default=0)
    
    # Vision board
    vision_image = models.ImageField(upload_to='visions/', blank=True, null=True)
    vision_text = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'goals'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.emoji} {self.title}"


class GoalProgress(models.Model):
    """Progress update for a goal"""
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='progress_updates')
    date = models.DateField()
    progress = models.IntegerField(default=0, help_text='Progress percentage')
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'goal_progress'
        ordering = ['-date']

    def __str__(self):
        return f"{self.goal.title} - {self.progress}%"