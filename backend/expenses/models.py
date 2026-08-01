"""
Expense Tracker Models - Expenses, Income, Categories
"""

from django.db import models
from django.conf import settings


class ExpenseCategory(models.Model):
    """Expense categories like Food, Travel, Shopping, etc."""
    name = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, default='💰')
    color = models.CharField(max_length=20, default='#FF6B6B')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expense_categories')
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'expense_categories'
        unique_together = ['name', 'user']

    def __str__(self):
        return f"{self.emoji} {self.name}"


class Expense(models.Model):
    """Individual expense entry"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True)
    
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    note = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'expenses'
        ordering = ['-date']

    def __str__(self):
        return f"{self.title} - ₹{self.amount}"


class Income(models.Model):
    """Income entry"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='incomes')
    source = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    note = models.TextField(blank=True)
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'incomes'
        ordering = ['-date']

    def __str__(self):
        return f"{self.source} - ₹{self.amount}"


class Savings(models.Model):
    """Monthly savings tracking"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='savings')
    month = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    goal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'savings'
        unique_together = ['user', 'month']

    def __str__(self):
        return f"Savings {self.month} - ₹{self.amount}"