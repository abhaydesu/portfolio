import "../globals.css";
import { Container } from "@/components/container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className="min-h-screen prose">
        {children}
    </Container>
  );
}
 