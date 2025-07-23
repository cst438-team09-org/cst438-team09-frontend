import './App.css';
import { useState } from 'react';
import { AdminRouter } from './components/admin/AdminLayout';
import { StudentRouter } from './components/student/StudentLayout';
import { InstructorRouter } from './components/instructor/InstructorLayout';
import Login from './Login';


function App() {

      const [isAuthenticated, setAuth] = useState(false);
      const [userType, setUserType] = useState('');

      const logout = () => {
            setAuth(false);
            sessionStorage.removeItem("jwt");
      }

      const login = (role, jwt) => {
            setAuth(true);
            setUserType(role);
            sessionStorage.setItem("jwt", "Bearer " + jwt);
      }

      // if the user is not authenticated, then perform Login
      // otherwise, display the home page based on user type

      if (!isAuthenticated) {
            return (
                  <Login setAuth={setAuth} login={login} />
            );
      } else if (userType === 'ADMIN') {
            return (
                  <AdminRouter logout={logout} />
            )
      } else if (userType === 'STUDENT') {
            return (
                  <StudentRouter logout={logout} />
            )

      } else if (userType === 'INSTRUCTOR') {
            return (
                  <InstructorRouter logout={logout} />
            )

      } else {
            return <h1>Unknown user type {userType} .</h1>

      }
}

export default App;

