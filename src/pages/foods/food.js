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
    const [food, setFood] = useState([])

    const { id } = useParams()
    const operation = id == 'add' ? 'add' : 'edit'
    _user = user



    docRef = firebase.firestore().collection('foods').doc(id)



    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setFood({
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



    if (!food) <></>



    return (



        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`alimentação (${operation == "add" ? "novo" : "editar"})`}
                previewPage='alimentação diária'
                previewPageLink='foods'
            />

            {
                operation !== "add"
                    ? <a href={`/food/add`} className="btn btn-secondary" id="add_button"><i className="fas fa-plus"></i>  criar um registro</a>
                    : <></>
            }

            <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                <h4 className="alert-heading">excluir registro #{food.code}</h4>
                <p>esse item será excluído, confirma?</p>
                <hr />
                <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', food.id)}>excluir</button>
                <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
            </div>

            <div className="card mt-5 mb-5">

                <div className="card-header">
                    alimentação {food.id ? '(# ' + food.code + ")" : ''}
                </div>

                <form className="row p-3" id="Form" onChange={() => fieldsVerify(food)}>
                    <div className="mb-3 col-md-4">
                        <label htmlFor="type" className="form-label">tipo de refeição</label>
                        <select id="type" className="form-control" value={food.type} onChange={(e) => setFood({ ...food, type: e.target.value })}>

                            <option selected value="">selecionar opção</option>
                            <option value="café da manhã">café da manhã</option>
                            <option value="almoço">almoço</option>
                            <option value="jantar">jantar</option>
                            <option value="lanche">lanche</option>
                            <option value="pulei o café da manhã">pulei o café da manhã</option>
                            <option value="pulei o almoço">pulei o almoço</option>
                            <option value="pulei o jantar">pulei o jantar</option>

                        </select>
                    </div>

                    <div className="mb-3 col-md-4">
                        <label htmlFor="perceivedSensation" className="form-label">sensação percebida</label>
                        <select id="perceivedSensation" className="form-control" value={food.perceivedSensation} onChange={(e) => setFood({ ...food, perceivedSensation: e.target.value })}>

                            <option selected value="">selecionar opção</option>
                            <option value="me sinto saciado">me sinto saciado</option>
                            <option value="estava sem fome">estava sem fome</option>
                            <option value="continuo com fome">continuo com fome</option>
                            <option value="comeria um pouco mais">comeria um pouco mais</option>
                            <option value="comi de mais">comi de mais</option>
                            <option value="sinto-me estufado">sinto-me estufado</option>
                            <option value="fiquei com azia">fiquei com azia</option>
                            <option value="fiquei dom dores de estômago">fiquei dom dores de estômago</option>
                            <option value="fiquei dom dores de cabeça">fiquei dom dores de cabeça</option>
                            <option value="comi pouco">comi pouco</option>

                        </select>
                    </div>
                    <div className="mb-3 col-md-4">
                        <label htmlFor="estimatedCalories" className="form-label">calorias estimadas</label>
                        <input type="text" className="form-control" id="estimatedCalories" placeholder="calorias estimadas" defaultValue={food.estimatedCalories} onChange={(event) => setFood({ ...food, estimatedCalories: event.target.value })} />
                    </div>

                    <div className="mb-3 col-md-12">
                        <label htmlFor="foodDetails" className="form-label">detalhes da refeição</label>
                        <textarea type="text" className="form-control" id="foodDetails" placeholder="detalhes da refeição" defaultValue={food.foodDetails} onChange={(event) => setFood({ ...food, foodDetails: event.target.value })} rows={2} />
                    </div>

                    <div className="mb-3 col-md-12">
                        <label htmlFor="comments" className="form-label">comentários</label>
                        <textarea type="text" className="form-control" id="comments" placeholder="comentários" defaultValue={food.comments} onChange={(event) => setFood({ ...food, comments: event.target.value })} rows={3} />
                    </div>
                    <div className="mb-3 col-md-12 mt-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, food, setFood)} id="submit_button">salvar</button>
                            <button type="button" className="btn btn-danger" id="delete_button" onClick={() => deleteItem("displayMessage")}>deletar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}



export const submitForm = (event, food, setFood) => {

    event.preventDefault()

    if (fieldsVerify(food)) {

        const _food = {
            code: food.code ? food.code : getCode(5),
            type: food.type ?? "",
            perceivedSensation: food.perceivedSensation ?? "",
            estimatedCalories: food.estimatedCalories ?? "",
            foodDetails: food.foodDetails ?? "",
            caloriesCalculation: food.caloriesCalculation > 0 ? food.caloriesCalculation : 0,
            comments: food.comments ?? "",
            userId: _user.uid ?? "",
            status: 1,
            created_at: food.code ? food.created_at : getDateTime(),
            updated_at: getDateTime(),
        }

        if (food.id) {
            _food.id = food.id
            updateData(_food)

        } else addData(_food)

        setFood(_food)
    }
}



export const addData = async (_food) => {

    await firebase.firestore().collection('foods').add(_food)

        .then((_docRef) => {

            toast.success("registro incluído com sucesso")

            setTimeout(
                () => window.location.href = `/food/${_docRef.id}`,
                1000
            )
        })

        .catch((error) => {

            toast.error(`erro ao tentar adicionar esse registro - erro: ${error}`)

            return false
        })
}



export const updateData = async (_food) => {

    await firebase.firestore().collection('foods')
        .doc(_food.id)
        .update(_food)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {

            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}




export const fieldsVerify = (food) => {

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
                    () => window.location.href = "/foods",
                    1000
                )
            })
            .catch(error => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })
    }
}