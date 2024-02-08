import { useState } from 'react'

const buttons = ['Register', 'Login']

interface Props {
  defaultTab?: string
}

const FormSwitch: React.FC<Props> = ({ defaultTab }) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab)

  const handleTabSelect = (title: string) => {
    setSelectedTab(title)
  }
  return (
    <div className="tabs-container">
      {buttons.map((title, i) => (
        <div className="tab-item" key={i}>
          <div
            className={
              selectedTab === title
                ? 'tab-title-wrapper selected'
                : 'tab-title-wrapper'
            }
            onClick={() => handleTabSelect(title)}
          >
            <button
              className={
                selectedTab === title
                  ? 'tab-btn tab-btn-selected'
                  : 'tab-btn selected'
              }
            >
              {title}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FormSwitch
