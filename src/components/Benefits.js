import { motion } from "framer-motion"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import SmartphoneIcon from "@mui/icons-material/Smartphone"
import HandshakeIcon from "@mui/icons-material/Handshake"

export default function Benefits() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-16 w-full max-w-6xl mx-auto px-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">Why PeopleFirst?</h2>
        <p className="text-gray-700 text-lg font-medium mb-12">
          Empowering change, one step at a time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {benefitItems.map(({ icon: Icon, title, description, color }, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className={`h-2 ${
              color === "blue" ? "bg-blue-500" :
              color === "green" ? "bg-green-500" :
              color === "yellow" ? "bg-yellow-500" :
              "bg-red-500"
            }`}></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full mr-4 ${
                  color === "blue" ? "bg-blue-100 text-blue-600" :
                  color === "green" ? "bg-green-100 text-green-600" :
                  color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  <Icon fontSize="large" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
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