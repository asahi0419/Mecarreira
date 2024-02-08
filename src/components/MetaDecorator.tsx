import React from 'react'
import { Helmet } from 'react-helmet'

interface Props {
  img: string
}

const MetaDecorator: React.FC<Props> = ({ img }) => (
  <Helmet>
    <meta name="title" content="MeCarreira - Nfts, Crypto and more"></meta>
    <meta property="og:type" content="website"></meta>
    <meta property="og:url" content="https://dev.mecarreira.com/"></meta>
    <meta
      property="og:title"
      content="MeCarreira - Nfts, Crypto and more1"
    ></meta>
    <meta
      property="og:description"
      content="With MeCarreira you can start your career in FussBall"
    ></meta>
    <meta property="og:image" itemProp="image" content={img}></meta>
    <meta property="twitter:card" content="summary_large_image"></meta>
    <meta property="twitter:url" content="https://dev.mecarreira.com/"></meta>
    <meta
      property="twitter:title"
      content="MeCarreira - turn your passion into money_22"
    ></meta>
    <meta
      property="twitter:description"
      content="With MeCarreira you can start your career in FussBall1"
    ></meta>
    <meta property="twitter:image" content={img}></meta>
  </Helmet>
)

export default MetaDecorator
