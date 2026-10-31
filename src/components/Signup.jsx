// Signup JSX file

import { useState} from "react";

function Signup() {
    const [message, setMessage] = useState("");
    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch("/api/signup", {
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
        } catch {
            setMessage("Could not connect to the server.");
        }
    }

    return (
        <main>
            <h1>Sign up</h1>
            {message && <p role="status">{message}</p>}

            <form className="post-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required autoComplete='username'></input>
                </div>

                <div> 
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required autoComplete='new-password'></input>
                </div>

                <button className='postButton' type='submit'>Sign Up</button>
            </form>
        </main>
    )
}

export default Signup;
