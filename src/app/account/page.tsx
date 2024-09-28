"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { login, register } from "@/http/userApi";
import { useRouter } from "next/navigation";

const Home = () => {
    const [loginScreen, setLoginScreen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter(); // Use Next.js useRouter hook

    const handleSubmit = async () => {
        setError("");

        // Ensure email and password are not undefined
        if (!email || !password) {
            setError("Email or password cannot be empty");
            return;
        }

        let result = loginScreen ? await login(email, password) : await register(email, password);
        if (!loginScreen) {
            setError("проверьте свою почту")
        }
        if (result && typeof result === "string") {
            setError(result);
        } else {
            router.push("/");
        }
        console.log(result)
    };


    return (
        <main className={styles.main}>
            {error && <div className={styles.error}>{error}</div>}
            <input
                name={"email"}
                placeholder={"email"}
                value={email}
                type={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                name={"password"}
                type="password"
                placeholder={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.submit} onClick={handleSubmit}>
                {loginScreen ? "Sign in" : "Sign up"}
            </button>
            <div className={styles.change} onClick={() => setLoginScreen(!loginScreen)}>
                {loginScreen ? "Go to Sign up" : "Go to Sign in"}
            </div>
        </main>
    );
};

export default Home;
