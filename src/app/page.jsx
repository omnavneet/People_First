import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Benefits from "../components/Benefits"
import ContactForm from "../components/Contacts"
import FAQ from "../components/FAQ"
import Process from "../components/Process"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <Navbar />

      <section
        id="home"
        className="h-screen flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-6xl font-bold text-black leading-tight">
          Together, We Make a <br /> Difference That Matters
        </h1>
        <p className="text-black text-[16px] font-semibold mt-3">
          People First is a website that connects those in need with the
          resources and support they need.
        </p>
        <Link
          href={"/check_signup"}
          className="bg-green-600 hover:bg-green-700 text-white text-[16px] px-6 py-2 rounded-lg mt-5 font-semibold shadow-2xl"
        >
          Get Involved
        </Link>
      </section>

      <section id="benefits" className="flex items-start justify-center pt-10">
        <Benefits />
      </section>

      <section
        id="about"
        className="flex flex-col items-center justify-center text-center mt-4 max-w-2xl mx-auto"
      >
        <div className="py-20">
          <h2 className="text-5xl font-bold text-black">About us</h2>
          <p className="text-black text-[20px] mt-3">
            At PeopleFirst, we’re more than just a platform—we’re a community.
            We know how overwhelming it can feel to face a disaster, whether
            it’s a natural crisis or a personal emergency. That’s why we created
            PeopleFirst: to make sure no one has to go through it alone. Our
            mission is simple—to bring people together, to offer real help, and
            to make support free and accessible for everyone. Because when we
            come together as a community, we’re stronger, kinder, and ready to
            face anything. This is about people helping people, and we’re here
            for you, every step of the way.
          </p>
        </div>
      </section>

      <section
        id="process"
        className="flex flex-col items-center justify-center text-center mt-4 max-w-2xl mx-auto"
      >
        <Process />
      </section>

      <section
        id="contact"
        className="flex flex-col items-center justify-center text-center mt-4 max-w-2xl mx-auto"
      >
        <ContactForm />
      </section>

      <section
        id="faq"
        className="flex flex-col items-center justify-center text-center mt-4 max-w-3xl mx-auto"
      >
        <FAQ />
      </section>

      <Footer />
    </div>
  )
}
