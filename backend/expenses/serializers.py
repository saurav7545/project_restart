from rest_framework import serializers
from .models import Expense, ExpenseCategory, Income, Savings


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'
        read_only_fields = ['user']


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['user']


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ['user']


class SavingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Savings
        fields = '__all__'
        read_only_fields = ['user']