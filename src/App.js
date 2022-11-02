import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import './App.css';
import initializeAuthentication from './Firebase/FirebaseInitialize';

const provider = new GoogleAuthProvider()

initializeAuthentication()
function App() {
  const handleGoogleSignIn = () => {
    const auth = getAuth()
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  }
  return (
    <div className="App">
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
    </div>
  );
}

export default App;
