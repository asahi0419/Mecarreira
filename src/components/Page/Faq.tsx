import { useState } from 'react'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

import { Faq as FaqItems } from '@root/constants'
import { useTranslation } from 'react-i18next'

interface Props {
  showButton?: boolean
}
const Faq: React.FC<Props> = ({ showButton }) => {
  const [selected, setSelected] = useState(0)
  const { t } = useTranslation()

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(-1)
    }
    setSelected(i)
  }

  const getTranslation = (text: string) => {
    const translation = t(text)
    if (translation === text) {
      return text
    } else {
      return translation
    }
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div className="accordion">
          {FaqItems.map((item, i) => (
            <div className="item" key={i}>
              <div className="title" onClick={() => toggle(i)}>
                <div>{getTranslation(item.question)}</div>
                {selected === i ? (
                  <RemoveIcon
                    style={{
                      color: 'var(--primary-foreground-color)',
                      width: '50px',
                      height: '50px',
                    }}
                  />
                ) : (
                  <AddIcon
                    style={{
                      color: 'var(--primary-foreground-color)',
                      width: '50px',
                      height: '50px',
                    }}
                  />
                )}
              </div>
              <div className={selected === i ? 'content show' : 'content line'}>
                {item.answer.map((text, index) => (
                  <p key={index}>{getTranslation(text)}</p>
                ))}
              </div>
            </div>
          ))}
          {showButton && <div className="mt-60" />}
        </div>
      </div>
    </div>
  )
}

export default Faq
