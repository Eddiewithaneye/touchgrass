import "./Header.css";
import Login from "./Login";

export default function Header( {onLoginClick} ) {


    return (
        <header className="header">
            <div className="inner">
                <div className="left">
                    <h1 className="logo">
                        🌿TouchGrass!
                    </h1>
                </div>
                <div className="right">
                    <button onClick={onLoginClick} className="login-btn">
                        Log In
                    </button>
                    <button className="menu">
                        Menu
                    </button>
                </div>
            </div>
        </header>
    )
}