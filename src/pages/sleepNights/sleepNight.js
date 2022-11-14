import { useEffect, useState, useContext} from 'react'
import firebase from '../../services/firebaseConnection'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { getDateTime, getCode } from '../../functions'
import { Navbar, Breadcrumb } from '../../components'
import { timeCalculation } from '../../functions'



const checkFields = false
let docRef, _user



export default function () {

    const { user, setUser } = useContext(AuthContext)
    const [sleepNight, setSleepNight] = useState([])

    const { id } = useParams()
    const operation = id == 'add' ? 'add' : 'edit'
    _user = user



    docRef = firebase.firestore().collection('sleepNights').doc(id)



    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setSleepNight({
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




    if (!sleepNight) <></>



    return (



        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`noite de sono (${operation == "add" ? "novo" : "editar"})`}
                previewPage='noites de sono'
                previewPageLink='sleepNights'
            />

            {
                operation !== "add"
                    ? <a href={`/sleepNight/add`} className="btn btn-secondary" id="add_button"><i className="fas fa-plus"></i>  criar um registro</a>
                    : <></>
            }

            <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                <h4 className="alert-heading">excluir registro #{sleepNight.code}</h4>
                <p>esse item será excluído, confirma?</p>
                <hr />
                <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', sleepNight.id)}>excluir</button>
                <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
            </div>

            <div className="card mt-5 mb-5">

                <div className="card-header">
                    horário de sono {sleepNight.id ? '(# ' + sleepNight.code + ")" : ''}
                </div>

                <form className="row p-3" id="Form" onChange={() => fieldsVerify(sleepNight)}>
                    <div className="mb-3 col-md-4">
                        <label htmlFor="start" className="form-label">início estimado</label>
                        <input type="text" className="form-control" id="start" placeholder="(formato: hh:mm)" defaultValue={sleepNight.start} onChange={(event) => setSleepNight({ ...sleepNight, start: event.target.value })} />
                        <small id="error_message_start" className='text-danger' style={{ display: 'none' }}>*** é necessário informar o horário aproximado do [início]! ***</small>
                    </div>
                    <div className="mb-3 col-md-4">
                        <label htmlFor="wakeUp" className="form-label">despertar estimado</label>
                        <input type="text" className="form-control" id="wakeUp" placeholder="(formato: hh:mm)" defaultValue={sleepNight.wakeUp} onChange={(event) => setSleepNight({ ...sleepNight, wakeUp: event.target.value })} />
                        <small id="error_message_wakeUp" className='text-danger' style={{ display: 'none' }}>*** é necessário informar o horário aproximado do [despertar]! ***</small>
                    </div>
                    <div className="mb-3 col-md-4">
                        <label htmlFor="sleepHours" className="form-label">tempo de sono</label>
                        <input type="text" className="form-control" id="sleepHours" defaultValue={sleepNight.sleepHours} disabled />                      
                    </div>
                    <div className="mb-3 col-md-6">
                            <label htmlFor="sleepQualitySensation"  className="form-label">qualidade de sono percebida</label>
                            <select id="sleepQualitySensation" className="form-control" value={sleepNight.sleepQualitySensation} onChange={(e) => setSleepNight({ ...sleepNight, sleepQualitySensation: e.target.value })}>

                                <option selected value="">selecionar opção</option>
                                <option value="sono reparador">sono reparador</option>
                                <option value="acordei com sono">acordei com sono</option>
                                <option value="acordei cansado">acordei cansado</option>
                                <option value="gostaria de dormir mais um pouco">gostaria de dormir mais um pouco</option>
                                <option value="dormi muito pouco">dormi muito pouco</option>
                                <option value="passei a noite em claro">passei a noite em claro</option>
                                <option value="acordei algumas vezes, mas peguei rapidamente no sono novamente">acordei algumas vezes, mas peguei rapidamente no sono novamente</option>
                                <option value="acordei algumas vezes e demorei um pouco para pegar no sono novamente">acordei algumas vezes e demorei um pouco para pegar no sono novamente</option>
                                <option value="acordei algumas vezes para ir ao banheiro">acordei algumas vezes para ir ao banheiro</option>
                                <option value="dormi de mais">dormi de mais</option>
                                <option value="dormi de mais e acordei com dores no corpo">dormi de mais e acordei com dores no corpo</option>
                                <option value="acordei com dores no corpo">acordei com dores no corpo</option>
                                <option value="acordei com dor de cabeça">acordei com dor de cabeça</option>
                                <option value="terrível">terrível</option>

                            </select>
                        </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="comments" className="form-label">comentários</label>
                        <textarea type="text" className="form-control" id="comments" placeholder="comentários" defaultValue={sleepNight.comments} onChange={(event) => setSleepNight({ ...sleepNight, comments: event.target.value })} rows={1} />
                    </div>                    
                    <div className="mb-3 col-md-12 mt-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, sleepNight, setSleepNight)} id="submit_button">salvar</button>
                            <button type="button" className="btn btn-danger" id="delete_button" onClick={() => deleteItem("displayMessage")}>deletar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}



export const submitForm = (event, sleepNight, setSleepNight) => {

    event.preventDefault()

    if (fieldsVerify(sleepNight)) {

        const _sleepNight = {
            code: sleepNight.code ? sleepNight.code : getCode(5),
            start: sleepNight.start ?? "",
            wakeUp: sleepNight.wakeUp ?? "",            
            sleepHours: timeCalculation(sleepNight.start, sleepNight.wakeUp),
            sleepQualitySensation: sleepNight.sleepQualitySensation ?? "",
            comments: sleepNight.comments ?? "",
            userId: _user.uid ?? "",
            userCode: 1,
            status: 1,
            created_at: sleepNight.code ? sleepNight.created_at : getDateTime(),
            updated_at: getDateTime(),
        }
       
        if (sleepNight.id) {
            _sleepNight.id = sleepNight.id
            updateData(_sleepNight)

        } else addData(_sleepNight)

        setSleepNight(_sleepNight)    
    }
}



export const addData = async (_sleepNight) => {

    await firebase.firestore().collection('sleepNights').add(_sleepNight)

        .then((_docRef) => {

            toast.success("registro incluído com sucesso")

            setTimeout(
                () => window.location.href = `/sleepNight/${ _docRef.id}`,
                1000
            )
        })

        .catch((error) => {

            toast.error(`erro ao tentar adicionar esse registro - erro: ${error}`)

            return false
        })
}



export const updateData = async (_sleepNight) => {

    await firebase.firestore().collection('sleepNights')
        .doc(_sleepNight.id)
        .update(_sleepNight)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {

            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}




export const fieldsVerify = (sleepNight) => {

    let verifyReturn = true

    if (checkFields) {

        if (!sleepNight.start || sleepNight.start.length < 2) {

            document.getElementById('error_message_start').style.display = "block"
            verifyReturn = false
        }

        if (!sleepNight.wakeUp || sleepNight.wakeUp.length < 2) {

            document.getElementById('error_message_wakeUp').style.display = "block"
            verifyReturn = false
        }


        document.getElementById('submit_button').disabled = !verifyReturn
        document.getElementById('delete_button').disabled = !verifyReturn
    }

    return verifyReturn
}



export const deleteItem = async (option, idToDelete) => {

    if(option==="displayMessage")  document.getElementById("deleteMessage").style.display = "block"
   
    else document.getElementById('deleteMessage').style.display = "none"
    
    if (option === 'delete') {

        docRef.delete()
        .then(() => {
            toast.success("registro excluído com sucesso!")

            setTimeout(
                () => window.location.href = "/sleepNights",
                1000
            )
        })
        .catch(error => {
            toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
        })
    }
}