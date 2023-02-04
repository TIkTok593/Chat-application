const APP_ID = 'e7c109abcd98417fbc2feef4f282bfbe'
const CHANNEL = 'kasdfj'
const TOKEN = '006e7c109abcd98417fbc2feef4f282bfbeIACDvcChoP0nRAFEoA3mmf4Zll7anC6vjNWFEUePNKYxhC4oN9/wa+luIgCB+ToDMB/gYwQAAQAwH+BjAgAwH+BjAwAwH+BjBAAwH+Bj'
let UID = 94;
const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handledUserJoined)
    client.on('user-left', handledUserLeft)

    await client.join(APP_ID, CHANNEL, TOKEN, UID)  // here we should provide user id (uid), but because we don't have one we put null instead, and this function will geneare a one for us(uid)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();  // I think this one that ask you for permission for camera and audio
    
    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">my name</span></div>
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
joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)