from django.urls import path

from . import views

urlpatterns = [
    path('', views.LoppyView.as_view()),
    path('room/', views.RoomView.as_view()),
    path('get-token', views.getToken),
    path('create-member/', views.CreateMember.as_view()),
    path('get-member/', views.CreateMember.as_view()),
]