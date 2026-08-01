from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom admin for User model"""
    list_display = ('username', 'email', 'level', 'xp', 'coins', 
                    'current_streak', 'is_active')
    list_filter = ('is_active', 'is_staff', 'date_joined')
    fieldsets = UserAdmin.fieldsets + (
        ('Gamification', {
            'fields': ('xp', 'coins', 'level', 'current_streak', 'longest_streak')
        }),
        ('Profile', {
            'fields': ('avatar', 'bio', 'dark_mode', 'email_notifications')
        }),
    )