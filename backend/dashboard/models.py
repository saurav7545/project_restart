"""
Dashboard Model - Daily Score, Quotes, and Dashboard Data
"""

from django.db import models
from django.conf import settings


class DailyScore(models.Model):
    """Daily overall score tracking"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daily_scores')
    date = models.DateField()
    
    score = models.IntegerField(default=0, help_text='Overall daily score 0-100')
    tasks_completed = models.IntegerField(default=0)
    study_hours = models.FloatField(default=0)
    habits_completed = models.IntegerField(default=0)
    recovery_clean = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daily_scores'
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"Score {self.date}: {self.score}"


class MotivationalQuote(models.Model):
    """Daily motivational quotes"""
    quote = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'motivational_quotes'

    def __str__(self):
        return f"{self.quote[:50]}... - {self.author}"