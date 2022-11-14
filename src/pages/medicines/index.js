import { useState, useEffect, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { Navbar, Breadcrumb, MyLink } from '../../components'
import { snapshotReadItems } from '../../services/db/snapshotReadItems'



const docRef = firebase.firestore().collection('medicines')



export default function () {

    const { user } = useContext(AuthContext)
    const [medicines, setMedicines] = useState([])



    const fetchData = async () => {

        await docRef.orderBy('created_at', 'desc').get()
            .then((snapshot) => {

                const _medicines = snapshotReadItems(snapshot).filter((u) => u.userId == user.uid)
                setMedicines(_medicines)

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

                    <table className="table text-center table-hover table-sm table-responsive table-striped">

                        <thead>
                            <tr>
                                <th>cod</th>
                                <th>genérico</th>
                                <th>referência</th>
                                <th>laboratório</th>
                                <th>posologia</th>
                                <th>R$</th>
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

    const _link = `/medicine/${item.id}`

    return (
        <tr>
            <td><MyLink link={_link}>{item.code}</MyLink></td>
            <td><MyLink link={_link}>{item.name}</MyLink></td>
            <td><MyLink link={_link}>{item.namerefer}</MyLink></td>
            <td><MyLink link={_link}>{item.laboratory}</MyLink></td>
            <td><MyLink link={_link}>{item.dosage}</MyLink></td>
            <td><MyLink link={_link}>{item.price}</MyLink></td>
        </tr>
    )
}