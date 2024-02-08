interface Props {
  img?: string
  title?: string
  desc?: string
}

const UtilityListItem: React.FC<Props> = ({ img, title, desc = 0 }) => {
  return (
    <div className="genesis-utility-item-root">
      <div className="genesis-utility-item-img">
        <img src={img} />
      </div>
      <div>
        <div className="genesis-utility-item-largetext">{title}</div>
        <div className="genesis-utility-item-smalltext">{desc}</div>
      </div>
    </div>
  )
}

export default UtilityListItem
