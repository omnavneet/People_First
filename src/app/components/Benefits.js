import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import SmartphoneIcon from "@mui/icons-material/Smartphone"
import HandshakeIcon from "@mui/icons-material/Handshake"

export default function Benefits() {
  return (
    <section className="py-10">
      <div className="text-center max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-black">Why PeopleFirst?</h2>
        <p className="text-black text-[16px] font-semibold mt-3">
          Empowering change, one step at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
        {benefitItems.map(
          ({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="flex flex-col items-start px-4 py-4 rounded-2xl shadow-md bg-white"
            >
              <div className="flex mb-3">
                <Icon
                  className={`${
                    color === "blue"
                      ? "text-blue-500"
                      : color === "green"
                      ? "text-green-500"
                      : color === "yellow"
                      ? "text-yellow-500"
                      : color === "red"
                      ? "text-red-500"
                      : "text-gray-500"
                  } text-4xl mr-3`}
                />
                <h3 className="text-2xl font-bold text-black">{title}</h3>
              </div>
              <div className="w-full border-b-4 border-dotted border-gray-400 mb-3"></div>
              <p className="text-black text-[16px]">{description}</p>
            </div>
          )
        )}
      </div>
    </section>
  )
}

const benefitItems = [
  {
    icon: VolunteerActivismIcon,
    title: "Community Support",
    description:
      "Connect with a network of compassionate individuals and organizations dedicated to providing real, meaningful help when you need it most.",
    color: "green",
  },
  {
    icon: HandshakeIcon,
    title: "Powered by People",
    description:
      "Our platform is 100% free and built by the community, ensuring everyone can access support without any cost or barriers.",
    color: "yellow",
  },
  {
    icon: RocketLaunchIcon,
    title: "Empower Growth",
    description:
      "Take control of your future with the right tools, resources, and guidance to help you grow and thrive in any situation.",
    color: "blue",
  },
  {
    icon: SmartphoneIcon,
    title: "Responsive",
    description:
      "A seamless, user-friendly experience across all devices, ensuring help is always just a click away, wherever you are.",
    color: "red",
  },
]
