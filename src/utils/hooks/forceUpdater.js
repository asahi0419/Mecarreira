import React from 'react'

// export default function useDataPersist() {
//   const [dataPersisted, setDataPersisted] = React.useState({})

//   function persistData(data) {
//     if (typeof data === 'object') {
//       const dataPersistedTemp = { ...dataPersisted }
//       //   dataPersistedTemp[key] = data
//       setDataPersisted(data)
//     } else {
//       console.error(
//         `Cannot copy typeof ${typeof data} to clipboard, must be a string or number.`,
//       )
//     }
//   }

//   return [dataPersisted, persistData(data)]
// }

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = React.useState(0) // integer state
  return () => setValue(value => value + 1) // update state to force render
  // A function that increment the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

export default useForceUpdate
