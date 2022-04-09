import React, {useRef, useState} from 'react';

const WebsocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const socket = useRef()

    function connect() {
        socket.current = new WebSocket('ws://localhost:4354')
        socket.current.onopen = () => {
            setConnected(true)
            console.log('Connected')
            const message = {
                event: 'connection', username, id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (e) => {
            const message = JSON.parse(e.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket is close')
        }
        socket.current.onerror = () => {
            console.log('Error')
        }
    }

    const sendMessage = async () => {
        const message = {
            username, message: value, id: Date.now(), event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (<div className={'center'}>
            <div className={'form'}>
                <input className={'text'} placeholder={'Your name'} type={'text'}
                       value={username} onChange={e => setUsername(e.target.value)}/>
                <button onClick={connect}>Sign up</button>
            </div>
        </div>)
    }

    return (<div className="center">
        <div>
            <div className="form">
                <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                <button onClick={sendMessage}>Отправить</button>
            </div>
            <div className="messages">
                {messages.map(mess => <div key={mess.id}>
                    {/*{console.log(mess.event)}*/}
                    {mess.event === 'connection' ?
                        <div className={'connection_message'}>User {mess.username} connected</div> :
                        <div className={'message'}>{mess.username}. {mess.message}</div>}
                </div>)}
            </div>
        </div>
    </div>);
};

export default WebsocketComponent;