export const AddressFormat = (address: string, chars = 10): string => {
  return `${address.slice(0, chars)}...`
}
