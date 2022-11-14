import { useState, useEffect } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { Navbar, Breadcrumb } from '../../components'



const docRef = firebase.firestore().collection('foods')



export default function () {

    const [foods, setFoods] = useState([])


    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
          .then((snapshot) => {
    
            setFoods(snapshotReadItems(snapshot))
    
          })
    
          .catch((error) => {
    
            toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
    
          })
      }
    
    
    
      useEffect(() => { fetchData() }, [])



    if (!foods) return <></>



    return (
        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb title="alimentação diária" />
                
            

            <div className="card">
                <div className="card-header">
                    <a href={`/food/add`} className="btn btn-secondary"><i className="fas fa-plus mr-3"></i>  criar um registro</a>

                </div>

                <div className="card-body table-responsive p-0" style={{ height: 500 }}>

                    <table className="table table-head-fixed text-nowrap">

                        <thead>
                            <tr>
                                <th>cód</th>
                                <th>data</th>
                                <th>type</th>
                                <th>cals</th>
                                <th>sensação</th>
                                <th>detalhes</th>
                                <th>comentários</th>
                                <th>st</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                foods && foods.length > 0

                                    ? foods.map((item, key) => {
                                        return (
                                            <SleepNightItem
                                                item={item}
                                                key={key}
                                            />
                                        )
                                    })
                                    : <h3 className='p-5'>não há registros para exibir...</h3>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}



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



export const SleepNightItem = ({ item }) => {

    return (
        <tr>
            <td>{item.code}</td>
            <td>{item.created_at}</td>
            <td>{item.type}</td>
            <td>{item.estimatedCalories}</td>
            <td>{item.perceivedSensation}</td>
            <td>{item.foodDetails.length > 20 ? item.foodDetails.substr(0, 20) + " (...)" : item.foodDetails}</td>
            <td>{item.comments.length > 20 ? item.comments.substr(0, 20) + " (...)" : item.comments}</td>
            <td>{item.status == 1 ? 'ok' : ''}</td>
            <td>
                <div className="btn-group btn-group-sm" role="group">
                    <a href={`/food/${item.id}`} className="btn btn-primary">editar</a>
                </div>
            </td>
        </tr>
    )
}