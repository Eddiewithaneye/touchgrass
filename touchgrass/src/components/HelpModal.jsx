import { useState } from "react";
import "./HelpModal.css";

export default function HelpModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("getting-started");

  if (!open) return null;

  const tabs = [
    { id: "getting-started", label: "Getting Started", icon: "🌱" },
    { id: "camera-tips", label: "Camera Tips", icon: "📸" },
    { id: "scoring", label: "Scoring", icon: "🏆" },
    { id: "objectives", label: "Objectives", icon: "🎯" }
  ];

  const content = {
    "getting-started": {
      title: "Welcome to TouchGrass!",
      sections: [
        {
          title: "What is TouchGrass?",
          content: "TouchGrass is a nature scavenger hunt that encourages you to explore the outdoors and identify plants, trees, and natural environments using your camera."
        },
        {
          title: "How to Play",
          content: "1. Click 'Start Exploring' to begin\n2. Use your camera to take photos of nature\n3. Submit photos to see if they match current objectives\n4. Earn points for successful matches\n5. Climb the leaderboard!"
        },
        {
          title: "Navigation",
          content: "• Use the menu button to access leaderboard, objectives, and your profile\n• Click the TouchGrass logo to return home\n• Your progress is automatically saved"
        }
      ]
    },
    "camera-tips": {
      title: "Camera & Photo Tips",
      sections: [
        {
          title: "Taking Great Photos",
          content: "• Ensure good lighting - natural daylight works best\n• Get close to your subject for clear details\n• Keep the camera steady to avoid blur\n• Fill the frame with your subject"
        },
        {
          title: "What to Photograph",
          content: "• Leaves, flowers, and plants\n• Tree bark and branches\n• Grass and ground cover\n• Natural landscapes\n• Wildlife (when safe to do so)"
        },
        {
          title: "Technical Tips",
          content: "• Allow camera permissions when prompted\n• Use the rear camera for better quality\n• Take multiple shots if the first doesn't work\n• Ensure your subject is well-lit and in focus"
        }
      ]
    },
    "scoring": {
      title: "Scoring System",
      sections: [
        {
          title: "How Points Work",
          content: "• Successful photo matches earn you points\n• Your success rate affects your ranking\n• Consecutive successful matches create streaks\n• Higher streaks earn bonus achievements"
        },
        {
          title: "Leaderboard",
          content: "• Rankings based on successful matches\n• Updated in real-time\n• Compete with other nature explorers\n• Top performers get special recognition"
        },
        {
          title: "Achievements",
          content: "🌱 First Success - Your first successful match\n🌿 Nature Explorer - 5 successful matches\n🌳 Tree Hugger - 10 successful matches\n🔥 On Fire - 3+ match streak\n🎯 Sharp Eye - 80%+ success rate"
        }
      ]
    },
    "objectives": {
      title: "Current Objectives",
      sections: [
        {
          title: "Scavenger Hunt Items",
          content: "• Find a leaf - Any tree or plant leaf\n• Find grass - Ground cover or lawn grass\n• Find a monster - Creative interpretation welcome!\n• Find a human - People in natural settings"
        },
        {
          title: "Tips for Success",
          content: "• Read objectives carefully\n• Be creative with interpretations\n• Focus on clear, well-lit subjects\n• Don't give up if first attempts don't work"
        },
        {
          title: "Objective Updates",
          content: "• Objectives may change over time\n• Check the menu regularly for updates\n• Completed objectives unlock new challenges\n• Seasonal objectives may appear"
        }
      ]
    }
  };

  const currentContent = content[activeTab];

  return (
    <div className="help-backdrop" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h3>❓ Help & Instructions</h3>
          <button className="help-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="help-content">
          <div className="help-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`help-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="help-body">
            <h4 className="help-title">{currentContent.title}</h4>
            
            {currentContent.sections.map((section, index) => (
              <div key={index} className="help-section">
                <h5 className="section-title">{section.title}</h5>
                <div className="section-content">
                  {section.content.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="content-line">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="help-footer">
          <button className="help-btn" onClick={onClose}>
            Got it! Let's explore 🌿
          </button>
        </div>
      </div>
    </div>
  );
}