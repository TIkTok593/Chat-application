from django.urls import path

from . import views

urlpatterns = [
    path('', views.LoppyView.as_view()),
    path('room/', views.RoomView.as_view()),
]