import "./Header.css";

export default function Header() {
    return (
        <header className="header">
            <div className="inner">
                <div className="left">
                    <h1 className="logo">
                        🌿TouchGrass!
                    </h1>
                </div>
                <div className="right">
                    <button className="login-btn">
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