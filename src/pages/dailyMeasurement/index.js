import { useState, useEffect, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { Navbar, Breadcrumb } from '../../components'



const docRef = firebase.firestore().collection('measurements')



export default function () {

  const { user } = useContext(AuthContext)
  const [measurements, setMeasurements] = useState([])



  const fetchData = async () => {

    await docRef.orderBy('created_at', 'desc').get()
      .then((snapshot) => {

        const _measurements = snapshotReadItems(snapshot).filter((u)=>u.userId==user.uid)
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

          <table className="table table-head-fixed text-nowrap table-hover table-sm table-responsive">

            <thead className="table-dark">
              <tr>
                <th>cod</th>
                <th>dt</th>              
                <th>máxima</th>
                <th>minima</th>
                <th>batimentos</th>
                <th>peso</th>
                <th></th>
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

  return (
    <tr>
      <td>{item.code}</td>
      <td>{item.measurement_at.substr(0,16)}</td>     
      <td>{item.maximum}</td>
      <td>{item.minimum}</td>
      <td>{item.heartbeat}</td>
      <td>{item.weight}</td>
      <td>
        <div className="btn-group btn-group-sm" role="group">
          <a href={`/dailyMeasurement/${item.id}`} className="btn btn-primary"><i className="fas fa-pen text-primary"></i>editar</a>
        </div>
      </td>
    </tr>
  )
}