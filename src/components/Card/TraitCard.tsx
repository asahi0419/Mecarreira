import React, { useState } from 'react'
import '@assets/css/components/TraitCard.css'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import { useTranslation } from 'react-i18next'

interface Props {
  id?: string
  title: string
  desc: string
  editable?: boolean
  onEdit?: any
  onDelete?: any
}

const TraitCard: React.FC<Props> = ({
  id,
  title,
  desc,
  editable,
  onEdit,
  onDelete,
}) => {
  const [showIcons, setShowIcons] = useState(false)
  const { t } = useTranslation()
  const handleMouseOver = () => {
    if (editable) {
      setShowIcons(true)
    }
  }
  const handleMouseOut = () => {
    if (editable) {
      setShowIcons(false)
    }
  }

  return (
    <div
      className="trait-card"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      {id ? (
        <>
          {showIcons && (
            <div className="trait-card-icons" onClick={handleMouseOut}>
              <EditOutlinedIcon
                onClick={() => id && onEdit && onEdit(id, title, desc)}
              />
              <DeleteForeverOutlinedIcon
                onClick={() => id && onDelete && onDelete(id)}
              />
            </div>
          )}
          <div className="trait-card-title">{title}</div>
          <div className="trait-card-desc">{desc}</div>
        </>
      ) : (
        <div
          className="trait-card-addicon"
          onClick={() => onEdit && onEdit('0', '', '')}
        >
          <AddCircleOutlinedIcon />
          <span>{t('add trait')}</span>
        </div>
      )}
    </div>
  )
}

export default TraitCard
