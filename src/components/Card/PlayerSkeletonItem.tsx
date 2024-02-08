import '@assets/css/components/PlayerItem.css'

const PlayerSkeletonItem: React.FC = () => {
  return (
    <div className="players-list-skeleton-item players-list-item">
      <div className="player-image-wrapper">
        <div className="player-number">&nbsp;</div>
        <div className="player-image">
          <div className="image-border"></div>
        </div>
      </div>
      <div className="player-info-wrapper">
        <div className="player-name-skeleton"></div>
        <div className="market-value-skeleton"></div>
      </div>
    </div>
  )
}

export default PlayerSkeletonItem
