import { Container } from "@/components/container";
import { Metadata } from "next";
import { Heading } from "@/components/heading"; 
import { Subheading } from "@/components/subheading";
import { ContactForm } from "@/components/contact-form";
import { Scales } from "@/components/scales";

export const metadata: Metadata = {
    title: "Contact Me",
    description: "Let's connect — open to collaborations, ideas, and conversations."
};

export default function Contact() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-8 px-8 md:pt-20 md:pb-10">
      <Scales />
      <Heading >
        Contact Me
      </Heading>
      <Subheading >
        whether it&#39;s a project or just a hello, I&#39;d love to hear from you.
      </Subheading>
      <ContactForm />
    </Container>
   </div>
  );
}
