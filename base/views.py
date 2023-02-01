from django.shortcuts import render
from django.views.generic import ListView

class LoppyView(ListView):
    def get(self, request):
        return render(request, 'base/loppy.html')


class RoomView(ListView):
    def get(self, request):
        return render(request, 'base/room.html')