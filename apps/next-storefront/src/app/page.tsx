import Image from "next/image";

export default function Home() {
  return(
    <main>
      <h1>Welcome to the Next.js Storefront</h1>
      <Image src="/path/to/image.jpg" alt="Product Image" width={500} height={500} />
    </main>
  )
}
