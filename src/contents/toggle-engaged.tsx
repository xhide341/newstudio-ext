import iconImage from "data-base64:~../assets/icon.png"
import cssText from "data-text:~/contents/toggle-engaged.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

import "./toggle-engaged.css"

export const config: PlasmoCSConfig = {
  matches: ["https://studio.youtube.com/*", "https://www.youtube.com/*"],
  css: ["toggle-engaged.css"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "newstudio-toggle-root"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  const analyticsContainer = document.querySelector(
    ".advanced-analytics-container"
  )
  if (!analyticsContainer) {
    console.error("Container not found: .advanced-analytics-container")
    return null
  }

  const advancedEl = analyticsContainer.querySelector("ytcp-ve")

  if (advancedEl) {
    return {
      element: advancedEl,
      insertPosition: "beforebegin"
    }
  }

  return {
    element: analyticsContainer,
    insertPosition: "beforeend"
  }
}

const ToggleEngaged = () => {
  const [enabled, setEnabled] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("light")

  useEffect(() => {
    // Check initial theme from <html dark="true" | "false" | null>
    const htmlEl = document.documentElement

    function updateTheme() {
      const darkAttr = htmlEl.getAttribute("dark")
      setTheme(darkAttr === "true" ? "dark" : "light")
    }

    updateTheme()

    const observer = new MutationObserver(() => {
      updateTheme()
    })

    observer.observe(htmlEl, { attributes: true, attributeFilter: ["dark"] })

    // Cleanup on unmount
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`toggle-container style-scope ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
      <img src={iconImage} alt="NewStudio Icon" className="toggle-icon" />
      <span className="toggle-label">Engaged</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
        <span className="slider" />
      </label>
    </div>
  )
}

export default ToggleEngaged
