from django.shortcuts import render
from django.views.generic import ListView
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random
import time
import json

from .models import RoomMember

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
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
    
@method_decorator(csrf_exempt, name='dispatch')
class CreateMember(ListView):
    # @method_decorator(csrf_exempt)
    # def dispatch(self, request, *args, **kwargs):
    #     return super(UserCreate, self).dispatch(request, *args, **kwargs)
    def get(self, request):
        uid = request.GET.get('uid')
        room_name = request.GET.get('room_name')
        member = RoomMember.objects.get(
            uid = uid,
            room_name = room_name,
        )
        name = member.name
        return JsonResponse({'name': member.name}, safe= False)
    
    def post(self, request):
        # print('sdfkaj   ')
        data = json.loads(request.body) # parse the data
        # print('sdfkaj   ')
        
        member, created = RoomMember.objects.get_or_create(
            name = data['name'],
            uid = data['UID'],
            room_name = data['room_name']
        )
        # print('sdfkaj   ')
        return JsonResponse({'name':data['name']}, safe=False)


# @csrf_exempt
# def createMember(request):
#     data = json.loads(request.body) # parse the data
#     member, created = RoomMember.objects.get_or_create(
#         name = data['name'],
#         uid = data['UID'],
#         room_name = data['room_name']
#     )
#     return JsonResponse({'name':data['name']}, safe=False)
