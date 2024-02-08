export const NumberFormat = (x: number) => {
  if (x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return 'NaN'
}
