import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login/*" element={<LoginPage />} />
        <Route path="landing/*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}


function Home() {
  document.getElementById('root').style.height = "100%";
  return (
    <div>
      <h2>Home</h2>
      <div>
        <nav>
          <Link to="login">LoginPage</Link>
        </nav>
      </div>
      <div>
        <nav>
          <Link to="landing">LandingPage</Link>
        </nav>
      </div>
    </div>
  );
}

// function Users() {
//   return (
//     <div>
//       <LandingPage />
//       <nav>
//         <Link to="me">LoginPage</Link>
//       </nav>

//       <Routes>
//         <Route path=":id" element={<LandingPage />} />
//         <Route path="me" element={<LoginPage />} />
//       </Routes>
//     </div>
//   );
// }
export default App;