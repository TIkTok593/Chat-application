const APP_ID = 'e7c109abcd98417fbc2feef4f282bfbe'

//because we stored our values in the session storage, we can retreive them
const CHANNEL = sessionStorage.getItem('room');
const TOKEN = sessionStorage.getItem('token');
let UID = Number(sessionStorage.getItem('UID'));
let NAME = sessionStorage.getItem('name')

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    document.getElementById('room-name').innerText = CHANNEL

    client.on('user-published', handledUserJoined)
    client.on('user-left', handledUserLeft)

    try{
        await client.join(APP_ID, CHANNEL, TOKEN, UID)  // here we should provide user id (uid), but because we don't have one we put null instead, and this function will geneare a one for us(uid)

    }catch(error){
        console.log(error)
        window.open('/chat', '_self')
    }

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();  // I think this one that ask you for permission for camera and audio
    console.log('hello')
    let member = createMember()
    console.log('hello')

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                  </div>`;
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
    
    localTracks[1].play(`user-${UID}`); //because on the local tracks, we assigned to elements to it(Microphone, Video) the second element is video so we'll play the video
    // What this play method do is inserting video tag, so we need to know where exactly to put video tag 

    await client.publish([localTracks[0], localTracks[1]]);
}

let handledUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }
        player = `<div class="video-container" id="user-container-${user.uid}">
        <div class="username-wrapper"><span class="user-name">my name</span></div>
        <div class="video-player" id="user-${user.uid}"></div>
      </div>`;
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
        user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType === 'video'){
        user.audioTrack.play()
    }
}

let handledUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/chat', '_self') // _self opens this window in this tab.
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}
let toggleMic= async (e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}
let createMember = async () => {
    let response = await fetch('/chat/create-member/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'name': NAME, 'room_name': CHANNEL, 'UID': UID})
    })
    let member = await response.json()
    return member
}
joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)