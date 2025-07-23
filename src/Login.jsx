import { useState } from 'react';
import { REGISTRAR_URL } from './Constants';

const Login = ({ login }) => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const onChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  const click = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/login`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(user.username + ':' + user.password),
          }
        });
      if (response.ok) {
        const data = await response.json();
        login(data.role, data.jwt);
        setMessage('');
      } else {
        setMessage("response error: " + response.status);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  }

  return (
    <div className="App">
      <h4>{message}</h4>
      <input id="email" type="text" name="username" placeholder='email id' value={user.username} onChange={onChange} />
      <input id="password" type="text" name="password" placeholder='password' value={user.password} onChange={onChange} />
      <button id="loginButton" onClick={click}>Login</button>
    </div >
  );
}

export default Login;