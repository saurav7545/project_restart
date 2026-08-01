"""
Study Tracker Models - Subjects, Study Sessions, Topics
"""

from django.db import models
from django.conf import settings


class Subject(models.Model):
    """Study subject like React, Python, DSA, etc."""
    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='📚')
    color = models.CharField(max_length=20, default='#4ECDC4')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subjects')
    
    total_hours = models.FloatField(default=0)
    weekly_hours = models.FloatField(default=0)
    monthly_hours = models.FloatField(default=0)
    
    topics_completed = models.IntegerField(default=0)
    topics_pending = models.IntegerField(default=0)
    progress_percentage = models.FloatField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subjects'
        unique_together = ['name', 'user']

    def __str__(self):
        return f"{self.emoji} {self.name}"


class Topic(models.Model):
    """Topic within a subject"""
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    resources = models.TextField(blank=True, help_text='Links to resources')
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'topics'

    def __str__(self):
        return f"{self.subject.name} - {self.name}"


class StudySession(models.Model):
    """Individual study session log"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_sessions')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='sessions')
    
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    
    topic = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    focus_level = models.IntegerField(default=5, help_text='1-10')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'study_sessions'
        ordering = ['-date', '-start_time']

    def __str__(self):
        return f"{self.subject.name} - {self.date}"