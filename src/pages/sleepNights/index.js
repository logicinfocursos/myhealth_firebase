import { useState, useEffect } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { Navbar, Breadcrumb, MyLink } from '../../components'
import { snapshotReadItems } from '../../services/db/snapshotReadItems'



const docRef = firebase.firestore().collection('sleepNights')



export default function () {



    const [sleepNights, setSleepNights] = useState([])



    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
            .then((snapshot) => {

                setSleepNights(snapshotReadItems(snapshot))

            })

            .catch((error) => {

                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)

            })
    }



    useEffect(() => { fetchData() }, [])



    if (!sleepNights) return <></>



    return (
        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />


            <Breadcrumb
                title="noites de sono"
            />

            <div className="card">
                <div className="card-header">
                    <a href={`/sleepNight/add`} className="btn btn-secondary"><i className="fas fa-plus mr-3"></i>  criar um registro</a>

                </div>

                <div className="card-body table-responsive p-0" style={{ height: 500 }}>

                <table className="table text-center table-hover table-sm table-responsive table-striped">

                        <thead>
                            <tr>
                                <th>cod</th>
                                <th>data</th>
                                <th>início</th>
                                <th>fim</th>
                                <th>num horas</th>
                                <th>sensação</th>
                                <th>comentários</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                sleepNights && sleepNights.length > 0

                                    ? sleepNights.map((item, key) => {
                                        return (
                                            <SleepNightItem
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



export const SleepNightItem = ({ item }) => {

    const _link = `/sleepNight/${item.id}`

    return (
        <tr>
            <td><MyLink link={_link}>{item.code}</MyLink></td>
            <td><MyLink link={_link}>{item.created_at}</MyLink></td>
            <td><MyLink link={_link}>{item.start}</MyLink></td>
            <td><MyLink link={_link}>{item.wakeUp}</MyLink></td>
            <td><MyLink link={_link}>{item.sleepHours}</MyLink></td>
            <td><MyLink link={_link}>{item.sleepQualitySensation.length > 20 ? item.sleepQualitySensation.substr(0, 20) + " (...)" : item.sleepQualitySensation}</MyLink></td>
            <td><MyLink link={_link}>{item.comments.length > 20 ? item.comments.substr(0, 20) + " (...)" : item.comments}</MyLink></td>
        </tr>
    )
}