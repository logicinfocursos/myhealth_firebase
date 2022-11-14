export const snapshotReadItems = (snapshot) => {

    let itens = []
  
    snapshot.forEach((doc) => {
  
      itens.push({
        ...doc.data(),
        id: doc.id,
      })
  
    })
  
    return itens
  }