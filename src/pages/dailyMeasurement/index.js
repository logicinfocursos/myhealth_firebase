import { useState, useEffect, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { Navbar, Breadcrumb, MyLink } from '../../components'



const docRef = firebase.firestore().collection('measurements')



export default function () {

  const { user } = useContext(AuthContext)
  const [measurements, setMeasurements] = useState([])



  const fetchData = async () => {

    await docRef.orderBy('created_at', 'desc').get()
      .then((snapshot) => {

        const _measurements = snapshotReadItems(snapshot).filter((u) => u.userId == user.uid)
        setMeasurements(_measurements)

      })

      .catch((error) => {

        toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)

      })
  }



  useEffect(() => { fetchData() }, [])



  if (!measurements) return <></>



  return (

    <div className="container" style={{ marginTop: 200 }}>

      <Navbar />

      <Breadcrumb
        title="medições"
      />

      <div className="card">
        <div className="card-header">
          <a href={`/dailyMeasurement/add`} className="btn btn-secondary"><i className="fas fa-plus mr-3"></i>  criar um registro</a>
        </div>

        <div className="card-body table-responsive p-0" style={{ height: 500 }}>

          <table className="table text-center table-hover table-sm table-responsive table-striped">

            <thead>
              <tr>
                <th>cod</th>
                <th>data</th>
                <th>máxima</th>
                <th>minima</th>
                <th>batimentos</th>
                <th>peso</th>
              </tr>
            </thead>

            <tbody>

              {
                measurements && measurements.length > 0

                  ? measurements.map((item, key) => {
                    return (
                      <MeasurementItem
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



export const MeasurementItem = ({ item }) => {

  const _link = `/dailyMeasurement/${item.id}`

  return (

    <tr>
      <td><MyLink link={_link}>{item.code}</MyLink></td>
      <td><MyLink link={_link}>{item.measurement_at.substr(0, 16)}</MyLink></td>
      <td><MyLink link={_link}>{item.maximum}</MyLink></td>
      <td><MyLink link={_link}>{item.minimum}</MyLink></td>
      <td><MyLink link={_link}>{item.heartbeat}</MyLink></td>
      <td><MyLink link={_link}>{item.weight}</MyLink></td>
    </tr >

  )
}