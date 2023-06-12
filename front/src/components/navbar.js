import React, { useContext } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { UserAuthContext } from "../App";

const Navbar = () => {
  const { currentUser, logOutHandler } =
    useContext(UserAuthContext);

  return (
    <nav className="navbar">
      <div className="container-navbar">
        <div className="drop-down-menu">
          {/* <input type="checkbox" id="btnControl" />
          <label className="btn" for="btnControl">
            <div className="dropdown-content">
              <a href="#">artists</a>
              <a href="#">boutique</a>
            </div>
          </label> */}
          <button>👅</button>
          <div className="dropdown-content">
            <a href="#">artists</a>
            <a href="#">boutique</a>
          </div>
        </div>
        <ul className="items-wrap">
          <li className="nav-item">
            <CustomLink to="/artists">artists</CustomLink>
          </li>
          <li className="nav-item">
            <CustomLink to="/e-commerce" props={{ currentUser: currentUser }}>
              boutique
            </CustomLink>
          </li>
        </ul>
        <div className="navbar-logo">
          <Link to="/">THE MEMERY</Link>
        </div>
        <ul className="items-wrap">
          <li className="nav-item">
            {currentUser.role !== 3 ? (
              <CustomLink to="/profile">
                profile
                {/* <MdPerson /> */}
              </CustomLink>
            ) : (
              <></>
            )}
          </li>
          <li className="nav-item">
            {currentUser.role !== 3 ? (
              <CustomLink onClick={logOutHandler} to="/">
                log out
              </CustomLink>
            ) : (
              <CustomLink to="/log-in">log in</CustomLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

//cette fonction permet d'encapsuler plusieurs choses dans une balise qui s'appelle CustomLink qui permet d'avoir un code plus propre
function CustomLink({ to, children, props, onClick }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <div className={`nav-item ${isActive ? "active" : ""}`}>
      <Link to={to} state={{ ...props }} onClick={onClick} className="nav-link">
        {children}
      </Link>
    </div>
  );
}

// function LogOutCustomLink({ to, children, props }) {
//   const resolvedPath = useResolvedPath(to);
//   const isActive = useMatch({ path: resolvedPath.pathname, end: true });
//   const ctx = useContext(UserAuthContext);
//   // ctx.onLogOut();
//   // const fct = () => {
//   //   ctx.onLogOut();
//   // };
//   // fct();

//   return (
//     <div className={`nav-item ${isActive ? "active" : ""}`}>
//       <Link to={to} state={{ ...props }} className="nav-link">
//         {children}
//       </Link>
//     </div>
//   );
// }

export default Navbar;
