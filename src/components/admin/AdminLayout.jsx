import { Outlet, Link } from "react-router-dom";
import UsersView from "./UsersView";
import CoursesView from "./CoursesView";
import SectionsView from "./SectionsView";
import Logout from "../../Logout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes, home page and nav bar for admin type user

export const AdminRouter = ({ logout }) => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UsersView />} />
            <Route path="courses" element={<CoursesView />} />
            <Route path="sections" element={<SectionsView />} />
            <Route path="logout" element={<Logout logout={logout} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export const AdminHome = () => {
  return (
    <div>
      <h1>Admin Home</h1>
      Manage users, courses and sections.
    </div>
  );
};

export const AdminLayout = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> &nbsp;|&nbsp;
        <Link to="/users">Users</Link>&nbsp;|&nbsp;
        <Link to="/courses">Courses</Link>&nbsp;|&nbsp;
        <Link to="/sections">Sections</Link>&nbsp;|&nbsp;
        <Link to="/logout">Logout</Link>
      </nav>
      <Outlet />
    </>
  );
};
