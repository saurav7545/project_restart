from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'expenses', views.ExpenseViewSet, basename='expenses')
router.register(r'categories', views.ExpenseCategoryViewSet, basename='expense-categories')
router.register(r'incomes', views.IncomeViewSet, basename='incomes')
router.register(r'savings', views.SavingsViewSet, basename='savings')

urlpatterns = [
    path('', include(router.urls)),
]