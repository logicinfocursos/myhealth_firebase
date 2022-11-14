import { useEffect, useState, useContext} from 'react'
import firebase from '../../services/firebaseConnection'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { getDateTime, getCode } from '../../functions'
import { Navbar, Breadcrumb } from '../../components'



const checkFields = true
let docRef, _user



export default function () {

    const { user, setUser } = useContext(AuthContext)
    const [measurement, setMeasurement] = useState([])
    const { id } = useParams()
    const operation = id == 'add' ? 'add' : 'edit'
    _user = user


    
    docRef = firebase.firestore().collection('measurements').doc(id)



    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setMeasurement({
                    ...snapshot.data(),
                    id: snapshot.id
                })
            })

            .catch((error) => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })
    }



    useEffect(() => {

        if (operation !== "add") fetchdata()

    }, [])



    if (!measurement) <></>



    return (

        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`medição (${operation == "add" ? "novo" : "editar"})`}
                previewPage="medições"
                previewPageLink="dailyMeasurements"
            />

            {
                operation !== "add"
                    ? <a href={`/dailyMeasurement/add`} className="btn btn-secondary" id="add_button"><i className="fas fa-plus"></i>  criar um registro</a>
                    : <></>
            }

            <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                <h4 className="alert-heading">excluir registro #{measurement.code}</h4>
                <p>esse item será excluído, confirma?</p>
                <hr />
                <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', measurement.id)}>excluir</button>
                <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
            </div>

            <div className="card mt-5 mb-5">
                <div className="card-header">
                    pressão / peso  {measurement.id ? '(# ' + measurement.code + ")" : ''}
                </div>
                <form className="row p-3" id="Form" onChange={() => fieldsVerify(measurement)}>
                    
                    <div className="mb-3 col-md-6">
                        <label htmlFor="maximum" className="form-label">pressão arterial sistólica</label>
                        <input type="text" className="form-control" id="maximum" placeholder="máxima" defaultValue={measurement.maximum} onChange={(event) => setMeasurement({ ...measurement, maximum: event.target.value })} />
                        <small id="error_message_maximum" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher a [máxima]! ***</small>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="minimum" className="form-label">pressão arterial diastólica</label>
                        <input type="text" className="form-control" id="minimum" placeholder="minima" defaultValue={measurement.minimum} onChange={(event) => setMeasurement({ ...measurement, minimum: event.target.value })} />
                        <small id="error_message_minimum" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher a [minima]! ***</small>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="heartbeat" className="form-label">nº de batimentos</label>
                        <input type="text" className="form-control" id="heartbeat" placeholder="batimentos" defaultValue={measurement.heartbeat} onChange={(event) => setMeasurement({ ...measurement, heartbeat: event.target.value })} />
                        <small id="error_message_heartbeat" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher o número de [batimentos]! ***</small>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="measurement_at" className="form-label">data / hora medição (formato: aaaa/mm/dd 99:99:99)</label>
                        <input type="text" className="form-control" id="measurement_at" placeholder="data e hora" defaultValue={measurement.measurement_at} onChange={(event) => setMeasurement({ ...measurement, measurement_at: event.target.value })} />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="weight" className="form-label">peso</label>
                        <input type="text" className="form-control" id="weight" placeholder="peso" defaultValue={measurement.weight} onChange={(event) => setMeasurement({ ...measurement, weight: event.target.value })} />
                        <small id="error_message_weight" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher o [peso]! ***</small>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="comments" className="form-label">comentários</label>
                        <textarea type="text" className="form-control" id="comments" placeholder="comentários" defaultValue={measurement.comments} onChange={(event) => setMeasurement({ ...measurement, comments: event.target.value })} rows={3} />
                    </div>
                    <div className="mb-3 col-md-12 mt-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, measurement, setMeasurement)} id="submit_button">salvar</button>
                            <button type="button" className="btn btn-danger" id="delete_button" onClick={() => deleteItem("displayMessage")}>deletar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}



export const submitForm = async (event, measurement, setMeasurement) => {

    event.preventDefault()

    if (fieldsVerify(measurement)) {

        const _measurement = {
            code: measurement.code ? measurement.code : getCode(5),
            weight: measurement.weight ? parseFloat(measurement.weight).toFixed(2) : 0,
            maximum: measurement.maximum ? parseInt(measurement.maximum) : 0,
            minimum: measurement.minimum ? parseInt(measurement.minimum) : 0,
            heartbeat: measurement.heartbeat ? parseInt(measurement.heartbeat) : 0,
            comments: measurement.comments ?? "",
            userCode: 1, //measurement.userCode,
            userId: _user.uid ?? "",
            status: 1, //measurement.status,
            measurement_at: measurement.measurement_at ? measurement.measurement_at : getDateTime(),
            created_at: measurement.code ? measurement.created_at : getDateTime(),
            updated_at: getDateTime(),
        }

        if (measurement.id) {
            _measurement.id = measurement.id
            updateData(_measurement)

        } else addData(_measurement)

        setMeasurement(_measurement)
    }
}



export const addData = async (_measurement) => {

    await firebase.firestore().collection('measurements').add(_measurement)

        .then((docRef) => {

            toast.success("registro incluído com sucesso")

            setTimeout(
                () => window.location.href = `/dailyMeasurement/${docRef.id}`,
                1000
            )
        })

        .catch((error) => {

            toast.error(`erro ao tentar adicionar esse registro - erro: ${error}`)

            return false
        })
}



export const updateData = async (_measurement) => {

    await firebase.firestore().collection('measurements')
        .doc(_measurement.id)
        .update(_measurement)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {
            console.log(`erro ao tentar atualizar esse registro - erro: ${error}`)
            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}




export const fieldsVerify = (measurement) => {

    let verifyReturn = true

    document.getElementById('error_message_weight').style.display = "none"
    document.getElementById('error_message_maximum').style.display = "none"
    document.getElementById('error_message_minimum').style.display = "none"
    document.getElementById('error_message_heartbeat').style.display = "none"

    if (checkFields) {

       /*  if (!measurement.weight) {

            document.getElementById('error_message_weight').style.display = "block"
            verifyReturn = false
        } */

        if (!measurement.maximum) {

            document.getElementById('error_message_maximum').style.display = "block"
            verifyReturn = false
        }

        if (!measurement.minimum) {

            document.getElementById('error_message_minimum').style.display = "block"
            verifyReturn = false
        }

        if (!measurement.heartbeat) {

            document.getElementById('error_message_heartbeat').style.display = "block"
            verifyReturn = false
        }

        document.getElementById('submit_button').disabled = !verifyReturn
        document.getElementById('delete_button').disabled = !verifyReturn
    }

    return verifyReturn
}



export const deleteItem = async (option) => {

    if (option === "displayMessage") document.getElementById("deleteMessage").style.display = "block"

    else document.getElementById('deleteMessage').style.display = "none"

    if (option === 'delete') {

        docRef.delete()
            .then(() => {
                toast.success("registro excluído com sucesso!")

                setTimeout(
                    () => window.location.href = "/dailyMeasurements",
                    1000
                )
            })
            .catch(error => {                
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })

    }
}