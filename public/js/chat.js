const socket = io()

//Elements
const messageForm = document.querySelector('#messageData')
const formInput = messageForm.querySelector('input')
const formButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

//Templates
const messageTemplate= document.querySelector('#message-template').innerHTML
const locationMessageTemplate= document.querySelector('#locationMessage-template').innerHTML

//options
const {username, room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.emit('join',{username,room})

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage', (msg)=>{
    console.log(msg)
    const html = Mustache.render(locationMessageTemplate,{
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
})

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    formButton.setAttribute('disabled','disabled')
    //disable the send button while the message is being sent

    const message = e.target.elements.message.value
    socket.emit("sendMessage",message,(error)=>{
        
        formButton.removeAttribute('disabled')
        formInput.value=''
        formInput.focus()
        //re-enable the send button after the message is sent
        //clear the input box of all text
        //bring the cursor back to the start of the box

        if(error)
        {
            return console.log(error)
        }
        console.log('message delivered')
    })
})

sendLocationButton.addEventListener('click',(e)=>{
    e.preventDefault()

    sendLocationButton.setAttribute('disabled','disabled')

    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            sendLocationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})