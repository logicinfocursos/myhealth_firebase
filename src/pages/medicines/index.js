import { useState, useEffect } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { Navbar, Breadcrumb } from '../../components'
import { snapshotReadItems } from '../../services/db/snapshotReadItems'



const docRef = firebase.firestore().collection('medicines')



export default function () {

    const [medicines, setMedicines] = useState([])

    

    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
          .then((snapshot) => {
    
            setMedicines(snapshotReadItems(snapshot))
    
          })
    
          .catch((error) => {
    
            toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
    
          })
      }
    
    
    
      useEffect(() => { fetchData() }, [])



    if (!medicines) return <></>



    return (
        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb title="medicamentos" />

            <div className="card">
                <div className="card-header">
                    <a href={`/medicine/add`} className="btn btn-secondary"><i className="fas fa-plus mr-3"></i>  criar um registro</a>

                </div>

                <div className="card-body table-responsive p-0" style={{ height: 500 }}>

                    <table className="table table-head-fixed text-nowrap">

                        <thead>
                            <tr>
                                <th>cod</th>
                                <th>genérico</th>
                                <th>referência</th>
                                <th>laboratório</th>
                                <th>posologia</th>
                                <th>R$</th>
                                <th>st</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                medicines && medicines.length > 0

                                    ? medicines.map((item, key) => {
                                        return (
                                            <MeasurementItem
                                                item={item}
                                                key={key}
                                            />
                                        )
                                    })
                                    : <></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}



export const MeasurementItem = ({ item }) => {

    return (
        <tr>
            <td>{item.code}</td>
            <td>{item.name}</td>
            <td>{item.namerefer}</td>
            <td>{item.laboratory}</td>
            <td>{item.dosage}</td>
            <td>{item.price}</td>
            <td>{item.status == 1 ? 'ok' : ''}</td>
            <td>
                <div className="btn-group btn-group-sm" role="group">
                    <a href={`/medicine/${item.id}`} className="btn btn-primary">editar</a>
                </div>
            </td>
        </tr>
    )
}