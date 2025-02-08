import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import SmartphoneIcon from "@mui/icons-material/Smartphone"

export default function Benefits() {
  return (
    <section className="py-10">
      <div className="text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-black">Why Choose PeopleFirst?</h2>
        <p className="text-black mt-2">Empowering change, one step at a time.</p>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-lg mx-auto">
        {benefitItems.map(({ icon: Icon, title, description, color }, index) => (
          <div key={index} className="flex flex-col items-start px-4 py-3 bg-white rounded-2xl shadow-md">
            <div className="flex mb-3">
                <Icon className={`text-${color}-500 text-4xl mr-4`} />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const benefitItems = [
  {
    icon: VolunteerActivismIcon,
    title: "Community Support",
    description: "Connect with people who truly care and provide real help.",
    color: "green",
  },
  {
    icon: AttachMoneyIcon,
    title: "Affordable Assistance",
    description: "Help should never be out of reach due to financial constraints.",
    color: "yellow",
  },
  {
    icon: RocketLaunchIcon,
    title: "Empower Growth",
    description: "Take control of your future with the right resources at hand.",
    color: "blue",
  },
  {
    icon: SmartphoneIcon,
    title: "Accessible Anywhere",
    description: "A seamless experience across all devices, ensuring help is always near.",
    color: "red",
  },
]
