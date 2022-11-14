import { useEffect, useState, } from 'react'
import firebase from '../../services/firebaseConnection'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { getDateTime, getCode } from '../../functions'
import { Navbar, Breadcrumb } from '../../components'
import { timeCalculation } from '../../functions'



const checkFields = true
let docRef


export default function () {

    const [weight, setWeight] = useState([])

    const { id } = useParams()
    const operation = id == 'add' ? 'add' : 'edit'



    docRef = firebase.firestore().collection('weights').doc(id)



    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setWeight({
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



    if (!weight) <></>



    return (



        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`pesagem diária (${operation == "add" ? "novo" : "editar"})`}
                previewPage='pesagens'
                previewPageLink='weights'
            />

            {
                operation !== "add"
                    ? <a href={`/weight/add`} className="btn btn-secondary" id="add_button"><i className="fas fa-plus"></i>  criar um registro</a>
                    : <></>
            }

            <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                <h4 className="alert-heading">excluir registro #{weight.code}</h4>
                <p>esse item será excluído, confirma?</p>
                <hr />
                <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', weight.id)}>excluir</button>
                <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
            </div>

            <div className="card mt-5 mb-5">

                <div className="card-header">
                    pesagem {weight.id ? '(# ' + weight.code + ")" : ''}
                </div>

                <form className="row p-3" id="Form" onChange={() => fieldsVerify(weight)}>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="value" className="form-label">peso</label>
                        <input type="text" className="form-control" id="value" placeholder="qual o seu peso hoje?" defaultValue={weight.value} onChange={(event) => setWeight({ ...weight, value: event.target.value })} />
                        <small id="error_message_value" className='text-danger' style={{ display: 'none' }}>*** é necessário informar o [peso]! ***</small>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label htmlFor="weighing_at" className="form-label">horário da pesagem</label>
                        <input type="text" className="form-control" id="weighing_at" placeholder="formato: 99:99" defaultValue={weight.weighing_at} onChange={(event) => setWeight({ ...weight, weighing_at: event.target.value })} />                        
                    </div>

                    <div className="mb-3 col-md-12">
                        <label htmlFor="comments" className="form-label">comentários</label>
                        <textarea type="text" className="form-control" id="comments" placeholder="comentários" defaultValue={weight.comments} onChange={(event) => setWeight({ ...weight, comments: event.target.value })} rows={3} />
                    </div>
                    <div className="mb-3 col-md-12 mt-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, weight, setWeight)} id="submit_button">salvar</button>
                            <button type="button" className="btn btn-danger" id="delete_button" onClick={() => deleteItem("displayMessage")}>deletar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}



export const submitForm = (event, weight, setWeight) => {

    event.preventDefault()

    if (fieldsVerify(weight)) {

        const _weight = {
            code: weight.code ? weight.code : getCode(5),
            value: weight.value > 0 ? parseFloat(weight.value).toFixed(2) : 0,
            comments: weight.comments ?? "",
            weighing_at: weight.weighing_at ?? "",
            userCode: 1,
            status: 1,
            created_at: weight.code ? weight.created_at : getDateTime(),
            updated_at: getDateTime(),
        }

        if (weight.id) {
            _weight.id = weight.id
            updateData(_weight)

        } else addData(_weight)

        setWeight(_weight)
    }
}



export const addData = async (_weight) => {

    await firebase.firestore().collection('weights').add(_weight)

        .then((_docRef) => {

            toast.success("registro incluído com sucesso")

            setTimeout(
                () => window.location.href = `/weight/${_docRef.id}`,
                1000
            )
        })

        .catch((error) => {

            toast.error(`erro ao tentar adicionar esse registro - erro: ${error}`)

            return false
        })
}



export const updateData = async (_weight) => {

    await firebase.firestore().collection('weights')
        .doc(_weight.id)
        .update(_weight)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {

            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}




export const fieldsVerify = (weight) => {

    let verifyReturn = true

    if (checkFields) {

        if (weight.value < 1) {

            document.getElementById('error_message_value').style.display = "block"
            verifyReturn = false
        }


        document.getElementById('submit_button').disabled = !verifyReturn
        document.getElementById('delete_button').disabled = !verifyReturn
    }

    return verifyReturn
}



export const deleteItem = async (option, idToDelete) => {

    if (option === "displayMessage") document.getElementById("deleteMessage").style.display = "block"

    else document.getElementById('deleteMessage').style.display = "none"

    if (option === 'delete') {

        docRef.delete()
            .then(() => {
                toast.success("registro excluído com sucesso!")

                setTimeout(
                    () => window.location.href = "/weights",
                    1000
                )
            })
            .catch(error => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })
    }
}