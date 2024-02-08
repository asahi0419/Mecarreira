import React, { useState } from 'react'
import '@assets/css/components/ClaimCard.css'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { useTranslation } from 'react-i18next'

interface Props {
  id: string
  title: string
  desc: string
  editable?: boolean
  isClaim: boolean
  onEdit?: any
  onDelete?: any
}

const ClaimCard: React.FC<Props> = ({
  id,
  title,
  desc,
  editable,
  isClaim,
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
    <>
      {(isClaim && !title && !desc) || (!isClaim && !desc) ? (
        <div
          className="trait-card"
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <div
            className="trait-card-addicon"
            onClick={() => onEdit && onEdit(id, title, desc, isClaim)}
          >
            <AddCircleOutlinedIcon />
            <span>{t('add ' + (isClaim ? 'claim' : 'description'))}</span>
          </div>
        </div>
      ) : (
        <div
          className="claim-card"
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          {showIcons && (
            <div className="claim-card-icons" onClick={handleMouseOut}>
              <EditOutlinedIcon
                onClick={() => onEdit && onEdit(id, title, desc, isClaim)}
              />
              <DeleteForeverOutlinedIcon
                onClick={() => onDelete && onDelete(id, isClaim)}
              />
            </div>
          )}
          <div className="claim-card-title">{title}</div>
          <div className="claim-card-desc">{desc}</div>
        </div>
      )}
    </>
  )
}

export default ClaimCard
