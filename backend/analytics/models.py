"""
Analytics Models - Aggregated analytics data
"""
from django.db import models
from django.conf import settings


class AnalyticsSnapshot(models.Model):
    """Weekly/monthly analytics snapshot"""
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='analytics_snapshots')
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()

    # Study stats
    total_study_hours = models.FloatField(default=0)
    study_days = models.IntegerField(default=0)

    # Habit stats
    habit_completion_rate = models.FloatField(default=0)

    # Expense stats
    total_expense = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_income = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Recovery stats
    clean_days = models.IntegerField(default=0)
    relapse_days = models.IntegerField(default=0)

    # Fitness stats
    avg_sleep_hours = models.FloatField(default=0)
    avg_water_glasses = models.FloatField(default=0)
    total_workout_minutes = models.IntegerField(default=0)

    # Overall
    avg_daily_score = models.FloatField(default=0)
    xp_gained = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'analytics_snapshots'
        unique_together = ['user', 'period', 'start_date']
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.period.capitalize()} Analytics - {self.start_date}"