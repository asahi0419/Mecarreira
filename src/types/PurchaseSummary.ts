interface SummaryItem {
  estimatedValue: string
  totalValue: string
}

interface ItemProps {
  label: string
  value: string
  isLoading: boolean
  isApprox?: boolean
  defaultValue?: string
  valueRightIcon?: any
  valueLeftIcon?: any
  isPercentage?: boolean
  customClass?: string
  priceImpactStyle?: string
  isPayout?: boolean
  bold?: boolean
  currency?: string
  setCurrency?: (v: any) => any
}

export type { SummaryItem, ItemProps }
