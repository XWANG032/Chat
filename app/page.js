'use client'
import Image from "next/image";
import React, {useState, useRef} from 'react'
import {Box, Stack, Button, TextField, InputAdornment } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
  }])

  const [message, setMessage] = useState('');
  const [showSearch, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messageRefs = useRef([]);
  const [messageId, setMessageId] = useState(0);
  const [matchedIndices, setMatchedIndices] = useState([]);


  const handleSearchView = () =>{
    setSearch(!showSearch)
    setSearchTerm('');
    setMatchedIndices([]); 
  };

  const searchMessage = () => {
    const filteredIndices = messages.map((msg, index) =>
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ? index : -1
    ).filter(index => index !== -1);

    setMatchedIndices(filteredIndices);

    if (filteredIndices.length > 0) {
      const firstMatchRef = messageRefs.current[filteredIndices[0]];
      if (firstMatchRef && firstMatchRef.current) {
        firstMatchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const sendMessage = async()=>{
    setMessages((messages)=>[
      ...messages,
      {role:'user', content: message, id: messageId},
      {role: 'assistant', content: '', id: messageId + 1},
    ])
    setMessage('')
    /***
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res)=>{
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result =''
      return reader.read().then(function processText({done, value}){
        if (done){
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages)=>{
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return([
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ])
        })
        return reader.read().then(processText)
      })
    })
      */
    setMessageId(prevId => prevId + 2);
  }

  return (
    <Box 
      width = "100vw" 
      height = "100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center">
        <Box 
        width = "600px" 
        height = "10vh" 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        border="1px solid black"
        paddingInlineStart={2}
        paddingInlineEnd={2}
        paddingTop={2}
        paddingBottom={2}
        style={{
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}>
        {
          showSearch ? (
            <Box
            width = "600px" 
            height = "10vh" 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" >
              <TextField variant="outlined" style={{width: "90%"}} placeholder = "Search..." 
              value = {searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter'){
                  e.preventDefault();
                  searchMessage();
                }
              }}>
                Test
              </TextField>
              <IconButton onClick={handleSearchView} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box         
            width = "600px" 
            height = "10vh" 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            paddingInlineStart={2}
            paddingInlineEnd={2}>
              <h2>Headstarter AI Customer Support Chat</h2>
              <IconButton onClick={handleSearchView} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Box>
          )
        }
        </Box>
        <Stack 
          direction="column" 
          width="600px" 
          height="700px" 
          border="1px solid black" 
          p={2} 
          spacing={3}
          style = {{
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px"
          }}>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow="auto"
              height="500px"
              paddingRight={1}
              >
              {messages.map((message, index) => {
                const messageRef = messageRefs.current[index] || React.createRef();
                if (!messageRefs.current[index]) {
                  messageRefs.current[index] = messageRef; 
                }
                
                const isMatched = matchedIndices.includes(index);

                return(
                  <Box key = {index} display="flex" justifyContent={
                    message.role==='assistant' ? 'flex-start' : 'flex-end'
                  } ref={messageRef}
                  >
                    <Box
                      bgcolor={
                        isMatched 
                        ? 'purple'
                        : message.role==='assistant'
                        ? '#FF75D8'
                        : '#7CF3A0'
                      }
                      color="white"
                      borderRadius={16}
                      p={3}
                    >
                    {message.content}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Message"
                fullWidth value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter'){
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                />
              <Button variant="contained" onClick={sendMessage} style={{backgroundColor: "#C21807"}}>
                Send
              </Button>
            </Stack>

        </Stack>
    </Box>
  )
}
