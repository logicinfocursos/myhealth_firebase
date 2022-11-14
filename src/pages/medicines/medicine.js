import { useEffect, useState, } from 'react'
import firebase from '../../services/firebaseConnection'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { getDateTime, getCode } from '../../functions'
import { Navbar, Breadcrumb } from '../../components'



const checkFields = false
let docRef



export default function () {

    const [medicine, setMedicine] = useState([])
    const [measurement, setMeasurement] = useState([])
    const { id } = useParams()
    const operation = id == 'add' ? 'add' : 'edit'



    docRef = firebase.firestore().collection('medicines').doc(id)



    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setMedicine({
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




    if (!medicine) <></>



    return (



        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`medicamento (${operation == "add" ? "novo" : "editar"})`}
                previewPage='medicamentos'
                previewPageLink='medicines'
            />

            {
                operation !== "add"
                    ? <a href={`/medicine/add`} className="btn btn-secondary" id="add_button"><i className="fas fa-plus"></i>  criar um registro</a>
                    : <></>
            }

            <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                <h4 className="alert-heading">excluir registro #{medicine.code}</h4>
                <p>item que será excluído  name: <strong>{medicine.name}</strong></p>
                <hr />
                <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', medicine.id)}>excluir</button>
                <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
            </div>

            <div className="card mt-5 mb-5">

                <div className="card-header">
                    medicamento {medicine.code ? '(# ' + medicine.code + ")" : ''}
                </div>

                <form className="row p-3" id="Form" onChange={() => fieldsVerify(medicine)}>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="name" className="form-label">nome genérico</label>
                        <input type="text" className="form-control" id="name" placeholder="nome genérico" defaultValue={medicine.name} onChange={(event) => setMedicine({ ...medicine, name: event.target.value })} />
                        <small id="error_message_name" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher o [nome genérico do medicamento]! ***</small>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="namerefer" className="form-label">nome de referência</label>
                        <input type="text" className="form-control" id="namerefer" placeholder="nome de referência" defaultValue={medicine.namerefer} onChange={(event) => setMedicine({ ...medicine, namerefer: event.target.value })} />                       
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="laboratory" className="form-label">laboratório</label>
                        <input type="text" className="form-control" id="laboratory" placeholder="nome de referência" defaultValue={medicine.laboratory} onChange={(event) => setMedicine({ ...medicine, laboratory: event.target.value })} />                       
                    </div>                    
                    <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">preço</label>
                        <input type="text" className="form-control" id="price" placeholder="preço" defaultValue={medicine.price} onChange={(event) => setMedicine({ ...medicine, price: event.target.value })} />
                    </div>   
                    <div className="mb-3 col-md-12">
                        <label htmlFor="dosage" className="form-label">posologia</label>
                        <textarea type="text" className="form-control" id="height" placeholder="posologia" defaultValue={medicine.dosage} onChange={(event) => setMedicine({ ...medicine, dosage: event.target.value })} />
                        <small id="error_message_dosage" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher a sua [altura]! ***</small>
                    </div>                
                    <div className="mb-3 col-md-12 mt-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, medicine, measurement, setMedicine)} id="submit_button">salvar</button>
                            <button type="button" className="btn btn-danger" id="delete_button"onClick={() => deleteItem("displayMessage")}>deletar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}



export const submitForm = (event, medicine, measurement, setMedicine) => {

    event.preventDefault()

    console.log(">>>submitForm", medicine)

    if (fieldsVerify(medicine)) {

        const _medicine = {
            code: medicine.id ? medicine.code : getCode(5),
            name: medicine.name  ?? '',
            namerefer: medicine.namerefer  ?? '',
            laboratory: medicine.laboratory  ?? '',
            dosage: medicine.dosage ?? '',
            price: !medicine.price || medicine.price < 1 ? 0 : parseFloat(medicine.price).toFixed(2),
            userCode: 1,
            status: 1,
            created_at: medicine.code ? medicine.created_at : getDateTime(),
            updated_at: getDateTime(),
        }
    
        if (medicine.id) {
            _medicine.id = medicine.id
            updateData(_medicine)

        } else addData(_medicine)

        setMedicine(_medicine)
    }
}



export const addData = async (_medicine) => {

    await firebase.firestore().collection('medicines').add(_medicine)

        .then((_docRef) => {

            toast.success("registro incluído com sucesso")

            setTimeout(
                () => window.location.href = `/medicine/${ _docRef.id}`,
                1000
            )
        })

        .catch((error) => {

            toast.error(`erro ao tentar adicionar esse registro - erro: ${error}`)

            return false
        })
}



export const updateData = async (_medicine) => {

    await firebase.firestore().collection('medicines')
        .doc(_medicine.id)
        .update(_medicine)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {

            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}



export const fieldsVerify = (medicine) => {

    let verifyReturn = true

    if (checkFields) {       

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
                    () => window.location.href = "/medicines",
                    1000
                )
            })
            .catch(error => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })
    }
}