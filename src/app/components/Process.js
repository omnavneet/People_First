import React from "react"
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"

const Process = () => {
  return (
    <section className="py-20">
      <div className="text-center max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-black">How It Works</h2>
        <p className="text-black text-[16px] font-semibold mt-3">
          Simple steps to get the help you need, when you need it most.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
        {processSteps.map(
          ({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="flex flex-col items-start px-4 py-4 bg-white rounded-2xl shadow-md"
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

const processSteps = [
  {
    icon: AccountCircleOutlinedIcon,
    title: "Sign Up",
    description:
      "Create your free account in just a few seconds. It’s quick, easy, and secure.",
    color: "blue",
  },
  {
    icon: SearchOutlinedIcon,
    title: "Find Help",
    description:
      "Search for resources, volunteers, or organizations near you that can provide support.",
    color: "green",
  },
  {
    icon: ChatOutlinedIcon,
    title: "Connect",
    description:
      "Reach out to the community, ask for help, or offer your support to others.",
    color: "yellow",
  },
  {
    icon: PeopleOutlinedIcon,
    title: "Get Support",
    description:
      "Receive the help you need, whether it’s resources, advice, or a helping hand.",
    color: "red",
  },
]

export default Process
