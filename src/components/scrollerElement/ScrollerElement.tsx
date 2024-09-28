import Image from 'next/image';
import styles from './ScrollerElement.module.css';
import { Props } from "@/types";
import Link from "next/link";

const ScrollerElement: React.FC<Props> = ({ title, background, description, className, link }) => {
    return (
        <div className={className}>
            <main className={styles.main}>
                <div className={styles.backgroundContainer}>
                    <Image
                        src={background}
                        alt="background image"
                        fill
                        className={styles.background}
                    />
                </div>
                {link ? (
                    <div className={styles.content}>
                        <div className={styles.text}>
                            <Link href={link}>
                                <h1 className={styles.title}>{title}</h1>
                                <p className={styles.description}>{description}</p>
                            </Link>
                        </div>

                    </div>
                ) : (
                    <div className={styles.content}>
                    <div className={styles.text}>
                            <h1 className={styles.title}>{title}</h1>
                            <p className={styles.description}>{description}</p>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default ScrollerElement;
