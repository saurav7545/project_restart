"""
Recovery Tracker Models - Porn/Masturbation recovery tracking
"""

from django.db import models
from django.conf import settings


class RecoveryLog(models.Model):
    """Daily recovery tracking log"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recovery_logs')
    date = models.DateField()
    
    porn_count = models.IntegerField(default=0)
    masturbation_count = models.IntegerField(default=0)
    urge_level = models.IntegerField(default=0, help_text='1-10')
    
    mood = models.CharField(max_length=20, default='😊')
    energy_level = models.IntegerField(default=5, help_text='1-10')
    stress_level = models.IntegerField(default=5, help_text='1-10')
    sleep_hours = models.FloatField(default=0)
    
    trigger = models.CharField(max_length=100, blank=True, 
                               choices=[
                                   ('phone', '📱 Phone'),
                                   ('loneliness', '😔 Loneliness'),
                                   ('stress', '😰 Stress'),
                                   ('instagram', '📸 Instagram'),
                                   ('youtube', '▶️ YouTube'),
                                   ('boredom', '😴 Boredom'),
                                   ('other', 'Other'),
                               ])
    notes = models.TextField(blank=True)
    
    clean_day = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'recovery_logs'
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"Recovery - {self.date} - {'✅ Clean' if self.clean_day else '❌ Relapse'}"


class RecoveryMilestone(models.Model):
    """Recovery milestones and achievements"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recovery_milestones')
    days_clean = models.IntegerField()
    achieved_at = models.DateTimeField(auto_now_add=True)
    badge = models.CharField(max_length=100)

    class Meta:
        db_table = 'recovery_milestones'
        ordering = ['-days_clean']

    def __str__(self):
        return f"{self.days_clean} days - {self.badge}"