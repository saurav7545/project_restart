"""
Custom User Model for Project Restart
- Extended user profile with avatar, XP, coins, level, streak
- Password hashing via Django's built-in bcrypt
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom user model with additional profile fields"""
    
    # Profile
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    
    # Gamification
    xp = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    
    # Streaks
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    
    # Preferences
    dark_mode = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
    
    def __str__(self):
        return self.username
    
    def add_xp(self, amount: int):
        """Add XP and check for level up"""
        self.xp += amount
        # Level up every 100 XP
        new_level = (self.xp // 100) + 1
        if new_level > self.level:
            self.level = new_level
        self.save()
    
    def add_coins(self, amount: int):
        """Add coins to user balance"""
        self.coins += amount
        self.save()
    
    def update_streak(self):
        """Update daily streak"""
        from datetime import date, timedelta
        today = date.today()
        
        if self.last_active_date == today:
            return
        
        if self.last_active_date == today - timedelta(days=1):
            self.current_streak += 1
        else:
            self.current_streak = 1
        
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        
        self.last_active_date = today
        self.save()