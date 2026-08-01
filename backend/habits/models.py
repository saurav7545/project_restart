"""
Habit Tracker Models - Habits and Daily Logs
"""

from django.db import models
from django.conf import settings


class Habit(models.Model):
    """Habit definition"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='habits')
    
    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='✅')
    color = models.CharField(max_length=20, default='#95E1D3')
    
    # Streak tracking
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    total_completions = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'habits'
        ordering = ['order']
        unique_together = ['name', 'user']

    def __str__(self):
        return f"{self.emoji} {self.name}"


class HabitLog(models.Model):
    """Daily habit completion log"""
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='habit_logs')
    
    date = models.DateField()
    completed = models.BooleanField(default=False)
    note = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'habit_logs'
        unique_together = ['habit', 'user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.habit.name} - {self.date} - {'✅' if self.completed else '❌'}"