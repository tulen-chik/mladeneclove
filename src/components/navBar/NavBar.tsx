import Image from 'next/image';
import styles from './NavBar.module.css';
import Link from "next/link";

const NavBar: React.FC = () => {
    return (
        <header className={styles.main}>
            <nav className={styles.left}>
                <Link href={'/'}>Anastasia Saldatsenka</Link>
            </nav>
            <nav className={styles.right}>
                <Link href={'/about'}>about</Link>
                <Link href={'/order'}>order</Link>
                <Link href={'/account'}>account</Link>
            </nav>
        </header>
    );
};

export default NavBar;
