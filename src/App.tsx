import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './App.css'

function App() {
  const navigate = useNavigate();
  const [loginName,setLoginName] = useState('');
  const [loginPass,setLoginPass] = useState('');
  const [SignInName,setSignInName] = useState('');
  const [SignInPass,setSignInPass] = useState('');
  const [filterdate,setFilterDate] = useState(100000000);
  const auth = async () =>
  {
    try 
    {
          console.log('sent');
          const response = await axios.post('http://localhost:3000/auth',{name:loginName,pass:loginPass});
          if(response.status == 200)
          {
              navigate('/tasks',{ state: { username: loginName } });
          }
          console.log('recieved');
          
    }
    catch
    {
        alert('Unauthorized');
        console.log('there was an error');
    }
  };
  const init = async () =>
    {
      try 
      {
            console.log('sent');
            const response = await axios.post('http://localhost:3000/init',{name:SignInName,pass:SignInPass});
            alert("Account Created");
      }
      catch
      {
          alert("Some Error Occured");
          console.log('there was an error');
      }
    };
  return (
    <>
      <div className='w-screen h-screen bg-blue-400 flex'>
        <div className='m-auto ml-72 w-96 h-1/2 bg-white rounded-2xl flex flex-col shadow-[0_0_10px_rgb(255,255,255)]'>
          <div className='m-auto mt-5 mb-5 p-5 text-3xl font-bold text-blue-400'>LOGIN</div>
          <input placeholder = 'Enter Username' className='hover-grow p-2 m-auto mt-5 mb-0 rounded-full border-2 border-blue-400 w-2/3 h-12' onChange={(e) => setLoginName(e.target.value)}/>
          <input type = 'password'placeholder = 'Enter Password' className='hover-grow p-2 m-auto mt-5 mb-0 rounded-full border-2 border-blue-400 w-2/3 h-12' onChange={(e) => setLoginPass(e.target.value)}/>
          <button className = 'hover-grow m-auto bg-blue-400 w-1/2 h-12 rounded-full text-white font-bold' onClick={auth}>Login</button>
        </div>
        <div className='m-auto mr-72 w-96 h-1/2 bg-white rounded-2xl flex flex-col shadow-[0_0_10px_rgb(255,255,255)]'>
        <div className='m-auto mt-5 mb-5 p-5 text-3xl font-bold text-blue-400'>SIGN UP</div>
          <input placeholder = 'Enter Username' className='hover-grow p-2 m-auto mt-5 mb-0 rounded-full border-2 border-blue-400 w-2/3 h-12' onChange={(e) => setSignInName(e.target.value)}/>
          <input type = 'password' placeholder = 'Enter Password' className='hover-grow p-2 m-auto mt-5 mb-0 rounded-full border-2 border-blue-400 w-2/3 h-12' onChange={(e) => setSignInPass(e.target.value)}/>
          <button className = 'hover-grow m-auto bg-blue-400 w-1/2 h-12 rounded-full text-white font-bold' onClick={init}>Sign In</button>
        </div>
      </div>
    </>
  )
}

export default App
