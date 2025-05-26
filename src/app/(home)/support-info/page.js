"use client"
import React, { useState } from "react"

const DisasterCard = ({ disaster, actions }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-200 transition-all duration-200">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <span className="text-xl">{disaster.icon}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{disaster.name}</h3>
    </div>
    <ul className="space-y-2">
      {actions.map((action, index) => (
        <li
          key={index}
          className="flex items-start space-x-2 text-sm text-gray-600"
        >
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <span>{action}</span>
        </li>
      ))}
    </ul>
  </div>
)

const ResourceCard = ({ icon, title, items, type = "list" }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    {type === "list" ? (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <span
              className="text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item }}
            ></span>
          </li>
        ))}
      </ul>
    ) : (
      <div className="space-y-3">
        {items.map((item, index) => (
          <p
            key={index}
            className="text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item }}
          ></p>
        ))}
      </div>
    )}
  </div>
)

const ChecklistItem = ({ item, checked, onToggle }) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <button
      onClick={onToggle}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
        checked
          ? "bg-green-500 border-green-500 text-white"
          : "border-gray-300 hover:border-green-400"
      }`}
    >
      {checked && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
    <span
      className={`text-sm leading-relaxed ${
        checked ? "text-gray-500 line-through" : "text-gray-700"
      }`}
    >
      {item}
    </span>
  </div>
)

export default function CrisisHelpCenter() {
  const [emergencyKitChecked, setEmergencyKitChecked] = useState({})
  const [familyPlanChecked, setFamilyPlanChecked] = useState({})

  const disasters = [
    {
      name: "Earthquake",
      icon: "🏠",
      actions: [
        "Drop to hands and knees immediately",
        "Take cover under sturdy furniture",
        "Hold on and protect your head",
        "Stay away from windows and heavy objects",
        "Move to open ground if outdoors",
      ],
    },
    {
      name: "Flood",
      icon: "🌊",
      actions: [
        "Move to higher ground immediately",
        "Avoid walking in moving water",
        "Never drive through flooded roads",
        "Stay away from downed power lines",
        "Listen to emergency broadcasts",
      ],
    },
    {
      name: "Cyclone",
      icon: "🌪️",
      actions: [
        "Secure all windows and doors",
        "Stock up on food and water",
        "Stay indoors during the storm",
        "Avoid using electrical appliances",
        "Keep emergency radio ready",
      ],
    },
    {
      name: "Fire",
      icon: "🔥",
      actions: [
        "Evacuate immediately",
        "Crawl low under smoke",
        "Stop, drop, and roll if clothes catch fire",
        "Never use elevators",
        "Call fire department immediately",
      ],
    },
    {
      name: "Heatwave",
      icon: "☀️",
      actions: [
        "Stay hydrated with water",
        "Avoid outdoor activities 12-4 PM",
        "Wear light-colored cotton clothes",
        "Use fans and AC when possible",
        "Check on elderly neighbors",
      ],
    },
    {
      name: "Cold Wave",
      icon: "❄️",
      actions: [
        "Wear multiple layers of clothing",
        "Keep extremities covered",
        "Ensure proper ventilation with heaters",
        "Stock up on warm food and drinks",
        "Avoid prolonged outdoor exposure",
      ],
    },
  ]

  const emergencyContacts = [
    "<strong>🚨 Police Emergency:</strong> 100",
    "<strong>🏥 Medical Emergency:</strong> 102, 108",
    "<strong>🔥 Fire Department:</strong> 101",
    "<strong>⚡ Disaster Management:</strong> 1070",
    "<strong>🆘 Women Helpline:</strong> 1091",
    "<strong>🧠 Mental Health:</strong> 1800-599-0019",
    "<strong>👶 Child Helpline:</strong> 1098",
    "<strong>🏛️ Tourist Helpline:</strong> 1363",
  ]

  const mentalHealthTips = [
    "<strong>Maintain daily routines</strong> to provide stability and normalcy during uncertain times",
    "<strong>Stay connected with loved ones</strong> through phone calls, video chats, or safe in-person visits",
    "<strong>Limit news consumption</strong> to avoid information overload and reduce anxiety",
    "<strong>Practice breathing exercises</strong> and meditation to manage stress and panic",
    "<strong>Seek professional help</strong> if you feel overwhelmed or experience persistent distress",
  ]

  const verificationTips = [
    "<strong>Cross-check multiple sources</strong> before believing or sharing information",
    "<strong>Look for official verification</strong> from government agencies or recognized organizations",
    "<strong>Check for grammatical errors</strong> and suspicious language in messages",
    "<strong>Verify sender credentials</strong> and contact information",
    "<strong>Report suspicious content</strong> to authorities and platform moderators",
  ]

  const yourRights = [
    "<strong>Right to shelter:</strong> Government must provide safe, accessible emergency shelters",
    "<strong>Right to healthcare:</strong> Free access to emergency medical care during disasters",
    "<strong>Right to information:</strong> Timely and accurate information about emergency situations",
    "<strong>Right to non-discrimination:</strong> Equal treatment regardless of background or status",
    "<strong>Right to legal aid:</strong> Free legal assistance through NALSA and state authorities",
  ]

  const emergencyKitItems = [
    "Water (1 gallon per person per day for 3 days)",
    "Non-perishable food (3-day supply per person)",
    "Battery-powered or hand-crank radio",
    "Flashlight and extra batteries",
    "First aid kit with essential medications",
    "Whistle for signaling help",
    "Dust masks and plastic sheeting",
    "Moist towels and garbage bags",
    "Wrench or pliers to turn off utilities",
    "Manual can opener for food",
    "Local maps and emergency contact list",
    "Cell phone with chargers and backup battery",
    "Cash and credit cards",
    "Emergency blankets and sleeping bags",
    "Change of clothing and sturdy shoes",
    "Fire extinguisher and smoke detector batteries",
    "Matches in waterproof container",
    "Important family documents (copies)",
  ]

  const familyPlanItems = [
    "Identify safe meeting places (home neighborhood and outside area)",
    "Choose an out-of-state contact person",
    "Program important phone numbers into all family phones",
    "Identify escape routes from home and neighborhood",
    "Know locations of gas, water, and electrical shut-offs",
    "Designate responsibilities for each family member",
    "Plan for family members with special needs",
    "Identify important documents and store copies safely",
    "Practice evacuation drills every 6 months",
    "Keep emergency supplies in easily accessible locations",
    "Plan for pets and service animals",
    "Know your children's school emergency plans",
  ]

  const communityPreparedness = [
    "<strong>Know your neighbors</strong> and build relationships before emergencies occur",
    "<strong>Join or form community groups</strong> focused on emergency preparedness and response",
    "<strong>Learn about local hazards</strong> and evacuation routes in your area",
    "<strong>Volunteer with local organizations</strong> like Red Cross or community emergency teams",
    "<strong>Share resources and skills</strong> with neighbors during planning and preparation",
    "<strong>Organize neighborhood drills</strong> and practice emergency communication methods",
  ]

  const recoveryResources = [
    "<strong>Document damage</strong> with photos before cleanup for insurance claims",
    "<strong>Contact insurance companies</strong> as soon as possible to begin claims process",
    "<strong>Keep receipts</strong> for all emergency expenses and temporary living costs",
    "<strong>Register with FEMA</strong> or local disaster relief agencies if eligible",
    "<strong>Beware of contractor fraud</strong> and get multiple estimates for repairs",
    "<strong>Take care of mental health</strong> - recovery is stressful and takes time",
  ]

  const toggleEmergencyKit = (index) => {
    setEmergencyKitChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const toggleFamilyPlan = (index) => {
    setFamilyPlanChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Crisis Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive emergency preparedness and response information to
              keep you and your community safe
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Disaster Response Guide */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Emergency Response Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick action steps for common disaster situations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasters.map((disaster, index) => (
              <DisasterCard
                key={index}
                disaster={disaster}
                actions={disaster.actions}
              />
            ))}
          </div>
        </section>

        {/* Emergency Preparedness */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Emergency Preparedness
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Essential checklists to prepare for emergencies
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎒</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Emergency Kit Checklist
                </h3>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {emergencyKitItems.map((item, index) => (
                  <ChecklistItem
                    key={index}
                    item={item}
                    checked={emergencyKitChecked[index] || false}
                    onToggle={() => toggleEmergencyKit(index)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Family Emergency Plan
                </h3>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {familyPlanItems.map((item, index) => (
                  <ChecklistItem
                    key={index}
                    item={item}
                    checked={familyPlanChecked[index] || false}
                    onToggle={() => toggleFamilyPlan(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Support & Information
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Essential contacts and guidance for crisis situations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              icon="📞"
              title="Emergency Contacts"
              items={emergencyContacts}
            />
            <ResourceCard
              icon="🧠"
              title="Mental Health Support"
              items={mentalHealthTips}
            />
            <ResourceCard
              icon="✅"
              title="Information Verification"
              items={verificationTips}
            />
            <ResourceCard
              icon="⚖️"
              title="Know Your Rights"
              items={yourRights}
            />
          </div>
        </section>

        {/* Community & Recovery */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Community & Recovery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building resilient communities and recovering from disasters
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              icon="🤝"
              title="Community Preparedness"
              items={communityPreparedness}
            />
            <ResourceCard
              icon="🔄"
              title="Recovery Resources"
              items={recoveryResources}
            />
          </div>
        </section>

        {/* Trusted Resources */}
        <section className="mb-16">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Trusted Official Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  National Disaster Management
                </h3>
                <a
                  href="https://ndma.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                  Visit NDMA Portal →
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Disaster Resource Network
                </h3>
                <a
                  href="https://idrn.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                  Access IDRN →
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Fact Verification
                </h3>
                <a
                  href="https://factcheck.pib.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                  Check PIB Facts →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Report Section */}
        <section className="mb-16">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-900">
                  Report Misinformation
                </h2>
                <p className="text-amber-800">
                  Help protect your community by reporting false or suspicious
                  information
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-amber-900 mb-3">
                  How to Report
                </h3>
                <p className="text-amber-800 text-sm mb-3">
                  Send detailed information with evidence to our community
                  safety team:
                </p>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <p className="text-amber-900 font-medium text-sm">
                    help@peoplefirst.org
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-amber-900 mb-3">
                  Warning Signs
                </h3>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>
                      Urgent requests for money or personal information
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Poor grammar in official-looking communications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Unverifiable contact information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Fear-based or emotionally manipulative content</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
