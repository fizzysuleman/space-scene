import logo from './logo.svg';
import './App.css';
import DisplayImages from './components/DisplayImages';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <DisplayImages/>
      </header>
    </div>
  );
}

export default App;
