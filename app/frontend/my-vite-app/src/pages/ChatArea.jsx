import { useNavigate    } from "react-router-dom";
import {authService  as result} from "../services/authService.js";  
import { use, useEffect, useRef } from "react";

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
    const messageEndRef = useRef(null)
    const typingEndRef = useRef(null)








    
}

