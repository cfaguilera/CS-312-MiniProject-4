// Sign in JSX file
import { useState} from 'react';

function Signin({onSignin}) {
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.get("username"),
                    password: formData.get("password"),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error);
                return;
            }

            setMessage(data.message);
            form.reset();
            onSignin(data.username);
        } catch {
            setMessage("Could not connect to the server");
        }
    }

    return (
        <main>
            <h1>Sign in</h1>
            {message && <p role="status">{message}</p>}

            <form className="post-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="signin-username">Username</label>
                    <input type="text" id="signin-username" name="username" autoComplete="username" required></input>
                </div>

                <div>
                    <label htmlFor="signin-password">Password</label>
                    <input type="password" id="signin-password" name="password" autoComplete="current-password" required></input>
                </div>

                <button className="postButton" type="submit">Sign In</button>
            </form>
        </main>
    );
}

export default Signin;
