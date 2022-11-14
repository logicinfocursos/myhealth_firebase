import { useState, useEffect } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { Navbar, Breadcrumb } from '../../components'
import { snapshotReadItems } from '../../services/db/snapshotReadItems'



const docRef = firebase.firestore().collection('physicalActivities')



export default function () {

    const [physicalActivities, setPhysicalActivities] = useState([])



    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
            .then((snapshot) => {

                setPhysicalActivities(snapshotReadItems(snapshot))

            })

            .catch((error) => {

                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)

            })
    }



    useEffect(() => { fetchData() }, [])



    if (!physicalActivities) return <></>



    return (
        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title="atividade física diária"
            />

            <div className="card">
                <div className="card-header">
                    <a href={`/physicalActivity/add`} className="btn btn-secondary"><i className="fas fa-plus mr-3"></i>  criar um registro</a>

                </div>

                <div className="card-body table-responsive p-0" style={{ height: 500 }}>

                    <table className="table table-head-fixed text-nowrap">

                        <thead>
                            <tr>
                                <th>cod</th>
                                <th>data</th>
                                <th>valor</th>
                                <th>comentários</th>
                                <th>st</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                physicalActivities && physicalActivities.length > 0

                                    ? physicalActivities.map((item, key) => {
                                        return (
                                            <PhysicalActivityItem
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



export const PhysicalActivityItem = ({ item }) => {

    return (
        <tr>
            <td>{item.code}</td>
            <td>{item.created_at}</td>
            <td>{item.value}</td>
            <td>{item.comments}</td>
            <td>{item.status == 1 ? 'ok' : ''}</td>
            <td>
                <div className="btn-group btn-group-sm" role="group">
                    <a href={`/physicalActivity/${item.id}`} className="btn btn-primary">editar</a>
                </div>
            </td>
        </tr>
    )
}