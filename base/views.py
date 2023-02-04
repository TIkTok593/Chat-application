from django.shortcuts import render
from django.views.generic import ListView
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random
import time


def getToken(request):
    app_id = 'e7c109abcd98417fbc2feef4f282bfbe'
    app_certificate = '4eee4eceafc04121aa69a6eb930adcdb'
    channel_name = request.GET.get('channel')
    uid = random.randint(1, 230)
    expiration_time_in_seconds = 3600 * 24 
    current_time_stamp = time.time()
    privilige_expire_time_stamp = current_time_stamp + expiration_time_in_seconds
    role = 1
    token = RtcTokenBuilder.buildTokenWithUid(appId=app_id, appCertificate=app_certificate, channelName=channel_name, uid=uid, role=role, privilegeExpiredTs=privilige_expire_time_stamp)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)

class LoppyView(ListView):
    def get(self, request):
        return render(request, 'base/loppy.html')


class RoomView(ListView):
    def get(self, request):
        return render(request, 'base/room.html')