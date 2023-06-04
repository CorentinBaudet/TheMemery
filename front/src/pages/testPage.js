// import React, { useContext, useState } from "react";
// import { UserAuthContext } from "../App";

// // const TestPage = () => {
// //   return (
// //     <UserContext.Consumer>
// //       <div>
// //         <h2>This is a test page</h2>
// //         {(isAuthenticated) => <h3>{isAuthenticated}</h3>}
// //       </div>
// //     </UserContext.Consumer>
// //   );
// // };

// // function TestPage() { // le component qui est rendered doit être une fonction
// //   return (
// //     <UserContext.Consumer>
// //       {(isAuthenticated) => ( // le retour de cette fonction doit être un render props pattern
// //         <div>
// //           <h2>This is a test page</h2>
// //           <h3>{isAuthenticated}</h3>
// //         </div>
// //       )}
// //     </UserContext.Consumer>
// //   );
// // }

// function TestPage() {
//   const ctx = useContext(UserAuthContext);
//   return (
//     <>
//       <Navbar onLogIn={ctx.onLogIn} />
//       <br />
//       <h2>This is a test page</h2>
//       <br />
//     </>
//   );
// }

// const Navbar = (props) => {
//   // autre manière en utilisant le React hook useContext()

//   const ctx = useContext(UserAuthContext);
//   // const [userRole, SetUserRole] = useState(3);

//   const LogIn = (event) => {
//     event.preventDefault(); // prevent from browser default reload / refresh
//     ctx.onLogIn(1);
//   };

//   return (
//     <div>
//       <br />
//       <nav>
//         <li>{ctx.userRole}</li>
//         <li>
//           {ctx.userRole === 3 ? (
//             <button
//               onClick={() => {
//                 ctx.onLogIn(1);
//               }}
//             >
//               log in
//             </button>
//           ) : (
//             // <button>log in</button>
//             <button onClick={ctx.onLogOut}>log out</button>
//             // <button>log out</button>
//           )}
//         </li>
//       </nav>
//     </div>
//   );
// };

// export default TestPage;

import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import APIRequest from "../services/fetchService";

export const LoginContext = createContext();

const Navigation = () => {
  const [currentUser, setCurrentUser] = useState(
    Cookies.get("currentUser") !== undefined
      ? JSON.parse(Cookies.get("currentUser"))
      : { username: "", role: 3 }
  );
  // const [userRole, setUserRole] = useState(
  //   Cookies.get("userRole") !== undefined ? Cookies.get("userRole") : 3
  // );

  const logInHandler = (userDetails) => {
    if (userDetails === null) {
      return;
    }
    setCurrentUser({
      username: userDetails.username,
      role:
        userDetails.role === "ROLE_USER"
          ? 0
          : userDetails.role === "ROLE_ARTIST"
          ? 1
          : 2,
    });
    // setUserRole(role);
  };

  const logOutHandler = () => {
    Cookies.remove("jwt");
    setCurrentUser({ username: "", role: 3 });
    // setUserRole(3);
  };

  async function checkJwt(storedJwt) {
    var isTokenValid = false;
    const reqBody = {
      token: storedJwt,
    };

    // appel à l'api pour tester si les credentials sont toujours valides
    await APIRequest("validate", "POST", storedJwt, reqBody).then(
      async (response) => {
        if (response.status === 200) {
          await response.json().then((data) => {
            isTokenValid = data;
          });
        }
      }
    );
    return isTokenValid;
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const storedJwt = Cookies.get("jwt"); // utiliser plutot les cookies avec la librairie 'js-cookie'
    var checkAuthResponse = await checkJwt(storedJwt);

    if (checkAuthResponse === false) {
      logOutHandler();
      return;
    }
  }

  useEffect(() => {
    Cookies.set("currentUser", JSON.stringify(currentUser), {
      expires: 1,
      secure: true,
    });
  }, [currentUser]);

  return (
    <LoginContext.Provider value={{ currentUser, logInHandler, logOutHandler }}>
      <Navbar />
    </LoginContext.Provider>
  );
};

const Navbar = () => {
  const { currentUser, logInHandler, logOutHandler } = useContext(LoginContext);

  async function TryLogIn() {
    var currentUser = null;

    // appel à l'api pour tester si les credentials sont ok
    const reqBody = {
      username: "default_user",
      password: "etna",
    };

    await APIRequest("authenticate", "POST", null, reqBody).then(
      async (response) => {
        if (response.status === 200) {
          await response.json().then((data) => {
            Cookies.set("jwt", data.token, {
              expires: 1,
              secure: true,
            });
          });
        }
      }
    );

    await APIRequest("me", "GET", Cookies.get("jwt")).then(async (response) => {
      if (response.status === 200) {
        await response.json().then((userDetails) => {
          currentUser = userDetails;
        });
      }
    });
    return currentUser;
  }

  return (
    <nav>
      {currentUser.role !== 3 ? (
        <ul>
          <li>Home</li>
          <li
            onClick={() => {
              alert(
                "je m'appelle " +
                  currentUser.username +
                  ", je suis role " +
                  currentUser.role
              );
            }}
          >
            Profile
          </li>
          <li
            onClick={() => {
              logOutHandler();
            }}
          >
            Logout
          </li>
        </ul>
      ) : (
        <ul>
          <li>Home</li>
          <li
            onClick={async () => {
              logInHandler(await TryLogIn());
            }}
          >
            Login
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
