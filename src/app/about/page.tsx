import { Container } from "@/components/container";

export default function AboutPage() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-[200vh] px-10 md:pt-20 md:pb-10">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary">
        About Me
      </h1>
      <p className="text-secondary text-sm md:text-sm pt-4 max-w-lg">
        Hi, I like keeping things simple — spending time with books, watching or playing football, talking about cars, and taking photos when something catches my eye.
        <br />

        I&#39;m someone who enjoys learning at my own pace and staying curious about different things, whether big or small. For me, it&#39;s less about big achievements and more about doing the things I enjoy and growing along the way.
      </p>
    </Container>
   </div>
  );
}
