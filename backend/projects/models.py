"""
Project Tracker Model
"""

from django.db import models
from django.conf import settings


class Project(models.Model):
    """Project tracking model"""
    STATUS_CHOICES = [
        ('planning', '📋 Planning'),
        ('in_progress', '🚀 In Progress'),
        ('review', '🔍 Review'),
        ('completed', '✅ Completed'),
        ('on_hold', '⏸ On Hold'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', '🟢 Low'),
        ('medium', '🟡 Medium'),
        ('high', '🔴 High'),
        ('critical', '🔥 Critical'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, default='💻')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    deadline = models.DateField(null=True, blank=True)
    github_link = models.URLField(blank=True)
    deployment_link = models.URLField(blank=True)
    
    progress_percentage = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-priority', 'deadline']

    def __str__(self):
        return f"{self.emoji} {self.name}"


class ProjectChecklist(models.Model):
    """Checklist items within a project"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='checklist')
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_checklist'
        ordering = ['order']

    def __str__(self):
        return f"{'✅' if self.completed else '⬜'} {self.title}"