"""
Fitness Tracker Models - Weight, Exercise, Water, Sleep, BMI
"""

from django.db import models
from django.conf import settings


class FitnessLog(models.Model):
    """Daily fitness log"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='fitness_logs')
    date = models.DateField()
    
    weight = models.FloatField(null=True, blank=True, help_text='Weight in kg')
    water_glasses = models.IntegerField(default=0, help_text='Number of glasses')
    sleep_hours = models.FloatField(default=0)
    calories_consumed = models.IntegerField(default=0)
    calories_burned = models.IntegerField(default=0)
    steps = models.IntegerField(default=0)
    
    running_km = models.FloatField(default=0)
    pushups = models.IntegerField(default=0)
    workout_minutes = models.IntegerField(default=0)
    
    bmi = models.FloatField(null=True, blank=True)
    mood = models.CharField(max_length=20, default='😊')
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fitness_logs'
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"Fitness - {self.date}"

    def calculate_bmi(self):
        """Calculate BMI if weight is provided"""
        if self.weight:
            # Assuming average height 1.7m if not specified
            height = 1.7
            self.bmi = round(self.weight / (height * height), 1)
        return self.bmi

    def save(self, *args, **kwargs):
        self.calculate_bmi()
        super().save(*args, **kwargs)