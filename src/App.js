import { useState } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from 'firebase/auth'
import './App.css';
import initializeAuthentication from './Firebase/FirebaseInitialize';

const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider();

initializeAuthentication()
function App() {
  const [userInfo, setUserInfo] = useState({})
  const handleGoogleSignIn = () => {
    const auth = getAuth()
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL, } = result.user;
        const userDetails = { name: displayName, email: email, img: photoURL };
        setUserInfo(userDetails);
      })
  }

  const handleGithubSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, photoURL, } = result.user;
        const userDetails = { name: displayName, img: photoURL };
        setUserInfo(userDetails);
      })
  }

  const handleSignOut = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
      setUserInfo({})
    })
  }
  return (
    <div className="App">
      {
        !userInfo.name ?
          <div>
            <button onClick={handleGoogleSignIn}>Google Sign In</button>
            <button onClick={handleGithubSignIn}>Github Sign In</button>
          </div> :
          <button onClick={handleSignOut}>Sign Out</button>}
      <br /><br />
      {
        userInfo.name &&
        <div>
          <img src={userInfo.img} alt="" />
          <h2>Welcome {userInfo.name}</h2>
          <p>I know your email {userInfo?.email}</p>
        </div>
      }
    </div>
  );
}

export default App;
