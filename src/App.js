import { useState } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import './App.css';
import initializeAuthentication from './Firebase/FirebaseInitialize';

const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider();

initializeAuthentication()
function App() {
  const [userInfo, setUserInfo] = useState({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const auth = getAuth()

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL, } = result.user;
        const userDetails = { name: displayName, email: email, img: photoURL };
        setUserInfo(userDetails);
      })
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, photoURL, } = result.user;
        const userDetails = { name: displayName, img: photoURL };
        setUserInfo(userDetails);
      })
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUserInfo({})
    })
  }

  const handleRegistration = (e) => {
    e.preventDefault();
  }

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChanged = (e) => {
    setPassword(e.target.value);
  }

  const handleIsRegistered = (e) => {
    setIsRegistered(e.target.checked);
  }

  const handleSubmit = () => {
    // console.log(email, password);
    if (password.length < 6) {
      setError('password must be at least 6 letter long');
      return
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Ensure string has two uppercase letters.');
      return
    }
    if (!/(?=.*[!@#$&*])/.test(password)) {
      setError('Ensure string has one special case letter.');
      return
    }
    if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError('Ensure string has two digits.');
      return
    }
    if (!/(?=.*[a-z].*[a-z].*[a-z])/.test(password)) {
      setError('Ensure string has three lowercase letters.');
      return
    }
    isRegistered ? processLogin(email, password) : createNewUser(email, password)

  }
  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result.user);
        setError('')
        verifyEmail()
      })
      .catch(error => {
        setError(error.message);
      })

  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result.user);
      }).catch(error => {
        setError(error.message)
      })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then((result) => {
        console.log(result);
      }).catch(err => {
        setError(err.message)
      })
  }
  const resetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {

      }).catch(err => setError(err.message))
  }

  return (
    <div className="App">

      <div className=' '>
        <form onSubmit={handleRegistration} className='w-50 mt-5  from'>
          <h3 className='text-primary mb-3'>Please {isRegistered ? 'Login' : 'Register'}</h3>
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input onBlur={handleEmailChanged} type="email" className="form-control" id="inputEmail3" />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <input onBlur={handlePasswordChanged} type="password" className="form-control" id="inputPassword3" />
              {
                error && <p className='text-danger'>{error}</p>
              }
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-10 offset-sm-2">
              <div className="form-check">
                <input onChange={handleIsRegistered} className="form-check-input" type="checkbox" id="gridCheck1" />
                <label className="form-check-label" htmlFor="gridCheck1">
                  Already Registered
                </label>
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} type="submit" className="btn btn-primary">{isRegistered ? 'Login' : 'Register'}</button>
          {isRegistered && <button className='btn btn-sm btn-dark' onClick={() => resetPassword(email)}>Reset Password</button>}
        </form>
      </div>
      <br /><br /><br /><br />
      <div className='text-center'>
        <p>..........................................................................................</p>
        {
          !userInfo.name ?
            <div>
              <button className='btn btn-primary me-2' onClick={handleGoogleSignIn}>Google Sign In</button>
              <button className='btn btn-primary' onClick={handleGithubSignIn}>Github Sign In</button>
            </div> :
            <button className='btn btn-primary' onClick={handleSignOut}>Sign Out</button>}
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
    </div>
  );
}

export default App;
