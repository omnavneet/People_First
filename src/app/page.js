import Benefits from "./components/Benefits";

export default function Home() {
  return (
    <div>
      <section
        id="home"
        className="h-screen flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-5xl font-bold text-black leading-tight">
          Together, We Make a <br /> Difference That Matters
        </h1>
        <p className="text-black text-[13px] font-semibold mt-3">
          People First is a website that connects those in need with  the
          resources and support they need.
        </p>
        <button className="bg-green-700 text-white text-[12px] px-5 py-2 rounded-full mt-5 font-semibold">
          Get Involved
        </button>
      </section>

      <section
        id="benefits"
        className="h-screen flex items-center justify-center"
      >
          <Benefits />
      </section>

      <section id="about" className="h-screen flex items-center justify-center">
        <h2 className="text-3xl">About us</h2>
      </section>

      <section
        id="process"
        className="h-screen flex items-center justify-center"
      >
        <h2 className="text-3xl">Our Process</h2>
      </section>

      <section
        id="contact"
        className="h-screen flex items-center justify-center"
      >
        <h2 className="text-3xl">Contact Us</h2>
      </section>

      <section id="faq" className="h-screen flex items-center justify-center">
        <h2 className="text-3xl">FAQ</h2>
      </section>
    </div>
  )
}
