import Image from 'next/image'

export default function Page() {
  // return <h1>Lessons!</h1>

  return (
    <>
      <Image 
          src="/logo_placeholder.png"
          width={240}
          height={190}
          alt="Logo placeholder"
          />
      <h1 className="lessons-title">Lessons</h1>
      <h2 className="Grammatik1">Grammatik1</h2>
      <h2 className="Grammatik1">Grammatik2</h2>
    </>
  );
}