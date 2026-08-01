"""
Notifications Model - Reminders and System Notifications
"""

from django.db import models
from django.conf import settings


class Notification(models.Model):
    """System notification model"""
    TYPE_CHOICES = [
        ('morning', '🌅 Morning'),
        ('study', '📚 Study'),
        ('workout', '🏃 Workout'),
        ('expense', '💰 Expense'),
        ('sleep', '😴 Sleep'),
        ('water', '💧 Water'),
        ('achievement', '🏆 Achievement'),
        ('reminder', '⏰ Reminder'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    
    scheduled_time = models.TimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.title}"


class NotificationPreference(models.Model):
    """User notification preferences"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_prefs')
    
    morning_reminder = models.BooleanField(default=True)
    morning_time = models.TimeField(default='06:00')
    
    study_reminder = models.BooleanField(default=True)
    study_time = models.TimeField(default='10:00')
    
    workout_reminder = models.BooleanField(default=True)
    workout_time = models.TimeField(default='17:00')
    
    expense_reminder = models.BooleanField(default=True)
    expense_time = models.TimeField(default='20:00')
    
    sleep_reminder = models.BooleanField(default=True)
    sleep_time = models.TimeField(default='22:00')
    
    water_reminder = models.BooleanField(default=True)
    water_interval = models.IntegerField(default=60, help_text='Minutes between reminders')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification_preferences'

    def __str__(self):
        return f"Notification prefs - {self.user.username}"