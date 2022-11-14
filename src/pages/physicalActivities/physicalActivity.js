import { useEffect, useState, } from 'react'
import firebase from '../../services/firebaseConnection'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { getDateTime, getCode } from '../../functions'
import { Navbar, Breadcrumb } from '../../components'
import { timeCalculation } from '../../functions'



const checkFields = false
let docRef



export default function () {

    const [physicalActivity, setPhysicalActivity] = useState([])

    const { id } = useParams()
    const operation = id == 'add' ? 'add' : 'edit'
    


    docRef = firebase.firestore().collection('physicalActivities').doc(id)



    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setPhysicalActivity({
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



    if (!physicalActivity) <></>



    return (



        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`atividade física (${operation == "add" ? "novo" : "editar"})`}
                previewPage='atividades físicas'
                previewPageLink='physicalActivities'
            />

            {
                operation !== "add"
                    ? <a href={`/physicalActivity/add`} className="btn btn-secondary" id="add_button"><i className="fas fa-plus"></i>  criar um registro</a>
                    : <></>
            }

            <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                <h4 className="alert-heading">excluir registro #{physicalActivity.code}</h4>
                <p>esse item será excluído, confirma?</p>
                <hr />
                <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', physicalActivity.id)}>excluir</button>
                <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
            </div>

            <div className="card mt-5 mb-5">

                <div className="card-header">
                    pesagem {physicalActivity.id ? '(# ' + physicalActivity.code + ")" : ''}
                </div>

                <form className="row p-3" id="Form" onChange={() => fieldsVerify(physicalActivity)}>

                    <div className="mb-3 col-md-3">
                        <label htmlFor="activity" className="form-label">atividade</label>
                        <select id="activity" className="form-control" value={physicalActivity.activity} onChange={(e) => setPhysicalActivity({ ...physicalActivity, activity: e.target.value })}>

                            <option selected defaultValue="">selecionar opção</option>
                            <option defaultValue="caminhada">caminhada</option>
                            <option defaultValue="corrida">corrida</option>
                            <option defaultValue="corrida e caminhada">corrida e caminhada</option>
                            <option defaultValue="trekker">trekker</option>
                            <option defaultValue="yoga">yoga</option>
                            <option defaultValue="byke">byke</option>
                            <option defaultValue="peso">peso</option>
                            <option defaultValue="abdominais">abdominais</option>
                            <option defaultValue="musculação">musculação</option>
                            <option defaultValue="aeróbico">aeróbico</option>
                            <option defaultValue="anaeróbio">anaeróbio</option>

                        </select>
                    </div>
                    <div className="mb-3 col-md-3">
                        <label htmlFor="intensity" className="form-label">intensidade</label>
                        <select id="intensity" className="form-control" value={physicalActivity.intensity} onChange={(e) => setPhysicalActivity({ ...physicalActivity, intensity: e.target.value })}>

                            <option selected defaultValue="">selecionar opção</option>
                            <option defaultValue="estou bem">bem leve</option>
                            <option defaultValue="estimulado">leve</option>
                            <option defaultValue="faria mais um pouco">moderado</option>
                            <option defaultValue="dificuldade para concluir">forte</option>
                            <option defaultValue="um pouco cansado">muito forte</option>

                        </select>
                    </div>
                    <div className="mb-3 col-md-3">
                        <label htmlFor="perceivedSensation" className="form-label">sensação percebida</label>
                        <select id="perceivedSensation" className="form-control" value={physicalActivity.perceivedSensation} onChange={(e) => setPhysicalActivity({ ...physicalActivity, perceivedSensation: e.target.value })}>

                            <option selected defaultValue="">selecionar opção</option>
                            <option defaultValue="estou bem">estou bem</option>
                            <option defaultValue="estimulado">estimulado</option>
                            <option defaultValue="faria mais um pouco">faria mais um pouco</option>
                            <option defaultValue="dificuldade para concluir">dificuldade para concluir</option>
                            <option defaultValue="um pouco cansado">um pouco cansado</option>
                            <option defaultValue="muito cansado">muito cansado</option>
                            <option defaultValue="leve">leve</option>
                            <option defaultValue="dores moderadas">dores moderadas</option>
                            <option defaultValue="dor de cabeça">dor de cabeça</option>
                            <option defaultValue="me lesioenei">me lesioenei</option>

                        </select>
                    </div>
                    <div className="mb-3 col-md-3">
                        <label htmlFor="local" className="form-label">local</label>
                        <select id="local" className="form-control" value={physicalActivity.local} onChange={(e) => setPhysicalActivity({ ...physicalActivity, local: e.target.value })}>

                            <option selected defaultValue="">selecionar opção</option>
                            <option defaultValue="outdoor">outdoor</option>
                            <option defaultValue="in door">in door</option>
                            <option defaultValue="academia">academia</option>
                            <option defaultValue="em casa">em casa</option>
                            <option defaultValue="estrada de terra">estrada de terra</option>
                            <option defaultValue="asfalto">asfalto</option>
                            <option defaultValue="parque">parque</option>
                            <option defaultValue="subida leve">subida leve</option>
                            <option defaultValue="subida moderada">subida moderada</option>
                            <option defaultValue="subida forte">subida forte</option>
                            <option defaultValue="reta e subida">reta e subida</option>
                        </select>
                    </div>
                   
                    <div className="mb-3 col-md-3">
                        <label htmlFor="calories" className="form-label">calorias aprox.</label>
                        <input type="text" className="form-control" id="calories" placeholder="calorias aprox" defaultValue={physicalActivity.calories} onChange={(event) => setPhysicalActivity({ ...physicalActivity, calories: event.target.value })} />                       
                    </div>
                    <div className="mb-3 col-md-3">
                        <label htmlFor="distance" className="form-label">distância aprox.em km</label>
                        <input type="text" className="form-control" id="distance" placeholder="distância aprox" defaultValue={physicalActivity.distance} onChange={(event) => setPhysicalActivity({ ...physicalActivity, distance: event.target.value })} />                       
                    </div>
                    <div className="mb-3 col-md-3">
                        <label htmlFor="start" className="form-label">início</label>
                        <input type="text" className="form-control" id="start" placeholder="formato: 00:00" defaultValue={physicalActivity.start} onChange={(event) => setPhysicalActivity({ ...physicalActivity, start: event.target.value })} />                       
                    </div>
                    <div className="mb-3 col-md-3">
                        <label htmlFor="end" className="form-label">fim</label>
                        <input type="text" className="form-control" id="end" placeholder="formato: 00:00" defaultValue={physicalActivity.end} onChange={(event) => setPhysicalActivity({ ...physicalActivity, end: event.target.value })} />                       
                    </div>

                    <div className="mb-3 col-md-3">
                        <label htmlFor="time" className="form-label">tempo</label>
                        <input type="text" className="form-control" id="time" defaultValue={physicalActivity.time} disabled />                       
                    </div>

                    <div className="mb-3 col-md-9">
                        <label htmlFor="comments" className="form-label">comentários</label>
                        <textarea type="text" className="form-control" id="comments" placeholder="comentários" defaultValue={physicalActivity.comments} onChange={(event) => setPhysicalActivity({ ...physicalActivity, comments: event.target.value })} rows={1} />
                    </div>
                    <div className="mb-3 col-md-12 mt-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, physicalActivity, setPhysicalActivity)} id="submit_button">salvar</button>
                            <button type="button" className="btn btn-danger" id="delete_button" onClick={() => deleteItem("displayMessage")}>deletar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}



export const submitForm = (event, physicalActivity, setPhysicalActivity) => {

    event.preventDefault()

    if (fieldsVerify(physicalActivity)) {

        const _physicalActivity = {
            code: physicalActivity.code ? physicalActivity.code : getCode(5),
            calories: physicalActivity.calories > 0 ? parseFloat(physicalActivity.calories).toFixed(2) : 0,
            activity: physicalActivity.activity ?? "",
            intensity: physicalActivity.intensity ?? "",
            perceivedSensation: physicalActivity.perceivedSensation ?? "",
            local: physicalActivity.local ?? "",          
            distance: physicalActivity.distance ?? "",
            start: physicalActivity.start ?? "",
            end: physicalActivity.end ?? "",
            comments: physicalActivity.comments ?? "",
            time: timeCalculation(physicalActivity.start, physicalActivity.end),
            userCode: 1,
            status: 1,
            created_at: physicalActivity.code ? physicalActivity.created_at : getDateTime(),
            updated_at: getDateTime(),
        }
    
        if (physicalActivity.id) {
            _physicalActivity.id = physicalActivity.id
            updateData(_physicalActivity)

        } else addData(_physicalActivity)

        setPhysicalActivity(_physicalActivity)
    }
}



export const addData = async (_physicalActivity) => {

    await firebase.firestore().collection('physicalActivities').add(_physicalActivity)

        .then((_docRef) => {

            toast.success("registro incluído com sucesso")

            setTimeout(
                () => window.location.href = `/physicalActivity/${ _docRef.id}`,
                1000
            )
        })

        .catch((error) => {

            toast.error(`erro ao tentar adicionar esse registro - erro: ${error}`)

            return false
        })
}



export const updateData = async (_physicalActivity) => {

    await firebase.firestore().collection('physicalActivities')
        .doc(_physicalActivity.id)
        .update(_physicalActivity)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {

            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}




export const fieldsVerify = (physicalActivity) => {

    let verifyReturn = true

    if (checkFields) {       

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
                    () => window.location.href = "/physicalActivities",
                    1000
                )
            })
            .catch(error => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })
    }
}