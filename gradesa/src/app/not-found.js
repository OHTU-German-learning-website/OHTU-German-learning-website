import Image from "next/image";

export default function Custom404() {
  return (
    <div>
      <h2>
        <Image src="/favicon.ico" alt="der Elefant" width={64} height={64} />
        404 - Page Not Found
      </h2>
    </div>
  );
}
