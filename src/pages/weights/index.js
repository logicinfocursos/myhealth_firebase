import { useState, useEffect, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { Navbar, Breadcrumb, MyLink } from '../../components'
import { snapshotReadItems } from '../../services/db/snapshotReadItems'



const docRef = firebase.firestore().collection('weights')



export default function () {

    const { user } = useContext(AuthContext)
    const [weights, setWeights] = useState([])



    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
            .then((snapshot) => {

                const _weights = snapshotReadItems(snapshot).filter((u) => u.userId == user.uid)
                setWeights(_weights)

            })

            .catch((error) => {

                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)

            })
    }



    useEffect(() => { fetchData() }, [])



    if (!weights) return <></>



    return (
        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title="pesagem"
            />

            <div className="card">
                <div className="card-header">
                    <a href={`/weight/add`} className="btn btn-secondary"><i className="fas fa-plus mr-3"></i>  criar um registro</a>

                </div>

                <div className="card-body table-responsive p-0" style={{ height: 500 }}>

                    <table className="table text-center table-hover table-sm table-responsive table-striped">

                        <thead>
                            <tr>
                                <th>code</th>
                                <th>data</th>
                                <th>valor</th>
                                <th>comentários</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                weights && weights.length > 0

                                    ? weights.map((item, key) => {
                                        return (
                                            <WeightItem
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



export const WeightItem = ({ item }) => {

    const _link = `/weight/${item.id}`

    return (
        <tr>
            <td><MyLink link={_link}>{item.code}</MyLink></td>
            <td><MyLink link={_link}>{item.created_at}</MyLink></td>
            <td><MyLink link={_link}>{item.value}</MyLink></td>
            <td><MyLink link={_link}>{item.comments}</MyLink></td>
        </tr>
    )
}