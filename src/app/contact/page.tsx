import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ContactForm from "./ContactForm";
import styles from "./Contact.module.css";

export default function ContactPage() {
    return (
        <>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>お問い合わせ</h1>
                <ContactForm />
            </main>
            <Footer />
        </>
    );
}
