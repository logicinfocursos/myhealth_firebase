import { useState, useEffect, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { Navbar, Breadcrumb, MyLink } from '../../components'
import { snapshotReadItems } from '../../services/db/snapshotReadItems'



const docRef = firebase.firestore().collection('physicalActivities')



export default function () {

    const { user } = useContext(AuthContext)
    const [physicalActivities, setPhysicalActivities] = useState([])



    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
            .then((snapshot) => {

                const _physicalActivities = snapshotReadItems(snapshot).filter((u) => u.userId == user.uid)
                setPhysicalActivities(_physicalActivities)

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

                    <table className="table text-center table-hover table-sm table-responsive table-striped">

                        <thead>
                            <tr>
                                <th>cod</th>
                                <th>data</th>
                                <th>atividade</th>
                                <th>intensidade</th>
                                <th>calorias</th>
                                <th>início</th>
                                <th>fim</th>
                                <th>tempo</th>
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

    const _link = `/physicalActivity/${item.id}`

    return (
        <tr>

            <td><MyLink link={_link}>{item.code}</MyLink></td>
            <td><MyLink link={_link}>{item.created_at}</MyLink></td>
            <td><MyLink link={_link}>{item.activity}</MyLink></td>
            <td><MyLink link={_link}>{item.intensity}</MyLink></td>
            <td><MyLink link={_link}>{item.calories}</MyLink></td>

            <td><MyLink link={_link}>{item.start}</MyLink></td>
            <td><MyLink link={_link}>{item.end}</MyLink></td>
            <td><MyLink link={_link}>{item.time}</MyLink></td>

        </tr>
    )
}