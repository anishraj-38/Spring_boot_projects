import { useNavigate    } from "react-router-dom";
import {authService  as result} from "../services/authService.js";  
import { use, useCallback, useEffect, useRef } from "react";import emoji from "emoji.json";

console.log(emoji); 



const ChatArea = () => {

    const navigate = useNavigate();
    const currentUser =  result.getCurrentUser

    useEffect(() => {
        if (!currentUser){
            navigate('/login')
            return
        }

    },
    [currentUser, navigate])

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [showEmojiPicker, setShowEmojiPicker] = useState("false")
    const [isTyping,setIsTyping] = useState('')
    const [privateChats,setPrivateChats] = useState(new Map())

    const [onlineUsers, setOnlineUsers] = useState([new set()])

    const privateMessageHandlers=useRef(new Map)
    const stompClient = useRef(null)
    const messagesEndRef = useRef(null)
    const typingEndRef = useRef(null)
    const emojiChars = emoji.map(e => e.char);

    console.log(emojiChars);

    if(!currentUser){
        return null;
    }

    const {username,color : userColor}  = currentUser;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    
    }

    const registerPrivateMessageHandler = useCallback((otherUser,handler)=> {
        privateMessageHandlers.current.set(otherUser,handler)
    },[])

    const unregisterPrivateMessageHandler = useCallback((otherUser)=> {
        privateMessageHandlers.current.delete(otherUser)
    },[])

    useEffect(() => {
        let reconnectInterval;

        const connectAndFetch = async () => {
            if(!username){
                return;
            }

            setOnlineUsers (prev =>{
                const prevSet = new Set(prev)
                newSet.add(username)
                return prevSet
            })

            }
        })
    

}