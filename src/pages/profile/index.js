import { useEffect, useState, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'
import { getDateTime, getCode } from '../../functions'
import { Navbar, Breadcrumb } from '../../components'
import noImage from '../../assets/avatar.png'



const checkFields = false
let docRef



export default function () {


    const { user, signOut, setUser, storageUser } = useContext(AuthContext)
    const [measurement, setMeasurement] = useState([])
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null)
    const id = 'tLwCrSxiZqhPmgEfSqrTXDX4Rii2'
    const userImage = user.avatarUrl ? user.avatarUrl : noImage

    docRef = firebase.firestore().collection('users').doc(id)


    function handleFile(e) {

        if (e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type === 'image/jpeg' || image.type === 'image/png') {

                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))

            } else {
                alert('Envie uma imagem do tipo PNG ou JPEG')
                setImageAvatar(null)
                return null
            }
        }
    }



    async function handleUpload() {
        const currentUid = user.uid

        const uploadTask = await firebase.storage()
            .ref(`images/${currentUid}/${imageAvatar.name}`)
            .put(imageAvatar)
            .then(async () => {
                console.log('FOTO ENVIADA COM SUCESSO!')

                await firebase.storage().ref(`images/${currentUid}`)
                    .child(imageAvatar.name).getDownloadURL()
                    .then(async (url) => {
                        let urlFoto = url

                        
                    })
            })
    }



   

    const fetchdata = async () => {

        await docRef.get()

            .then((snapshot) => {
                setUser({
                    ...snapshot.data(),
                    id: snapshot.id
                })
            })

            .catch((error) => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })

    }



    useEffect(() => {

        fetchdata()

    }, [])



    if (!user) <></>


    
 

    return (



        <div className="container" style={{ marginTop: 200 }}>

            <Navbar />

            <Breadcrumb
                title={`perfil (editar)`}
            />

            <div className='row'>

                <div className='col-md-9'>
                    <div className="alert alert-danger mb-3 mt-3" role="alert" style={{ display: "none" }} id="deleteMessage">
                        <h4 className="alert-heading">excluir registro #{user.id}</h4>
                        <p>item que será excluído  name: <strong>{user.name}</strong></p>
                        <hr />
                        <button type="button" className="btn btn-dark" onClick={() => deleteItem('delete', user.id)}>excluir</button>
                        <button type="button" className="btn btn-secondary" onClick={() => deleteItem('quit')}>desistir</button>
                    </div>
                    <div className="card mt-5 mb-5">

                        <div className="card-header">
                            perfil {user.id ? '(# ' + user.id + ")" : ''}
                        </div>

                        <form className="row p-3" id="Form" onChange={() => fieldsVerify(user)}>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="name" className="form-label">nome</label>
                                <input type="text" className="form-control" id="name" defaultValue={user.name} disabled />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="email" className="form-label">email</label>
                                <input type="text" className="form-control" id="email" defaultValue={user.email} disabled />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="birthdate" className="form-label">data de nascimento</label>
                                <input type="text" className="form-control" id="birthdate" placeholder="nascimento" defaultValue={user.birthdate} onChange={(event) => setUser({ ...user, birthdate: event.target.value })} />
                                <small id="error_message_birthdate" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher a [data de nascimento]! ***</small>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="height" className="form-label">altura</label>
                                <input type="text" className="form-control" id="height" placeholder="altura" defaultValue={user.height} onChange={(event) => setUser({ ...user, height: event.target.value })} />
                                <small id="error_message_height" className='text-danger' style={{ display: 'none' }}>*** é necessário preencher a sua [altura]! ***</small>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="imc" className="form-label">imc</label>
                                <input type="text" className="form-control" id="imc" defaultValue={user.imc} disabled />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="classification" className="form-label">classificação</label>
                                <input type="text" className="form-control" id="classification" defaultValue={user.imcclassification} disabled />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="bloodtype" className="form-label">tipo sanguíneo</label>
                                <input type="text" className="form-control" id="bloodtype" placeholder="bloodtype" defaultValue={user.bloodtype} onChange={(event) => setUser({ ...user, bloodtype: event.target.value })} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="password" className="form-label">nova senha</label>
                                <input type="password" className="form-control" id="password" placeholder="senha" defaultValue={user.password} onChange={(event) => setUser({ ...user, password: event.target.value })} />
                            </div>
                            <div className="mb-3 col-md-12 mt-5">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-primary" onClick={(event) => submitForm(event, user, setUser, measurement)} id="submit_button">salvar</button>
                                    <button type="button" className="btn btn-danger" id="submit_button" onClick={() => deleteItem("displayMessage")}>deletar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='col-md-3'>
                    <div className='card mt-5'>
                        <div className='card-header'>
                            <h1>imagem</h1>
                        </div>
                        <div className='card-body'>
                            <img src={userImage} className="img-thumbnail" />
                        </div>
                        <div className='card-footer'>
                            <div className="input-group">

                                <input type="file" className="btn btn-outline-secondary" id="image-upload" accept="image/*" onChange={handleFile} />
                                <button className="btn btn-outline-secondary" type="button">salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}



export const submitForm = (event, user, setUser, measurement) => {

    event.preventDefault()

    if (fieldsVerify(user)) {

        const imc = user.height > 0 ? (measurement.weight / (user.height * 2)) : 0

        const _user = {
            ...user,
            code: user.code ? user.code : getCode(5),
            name: user.name ?? '',
            birthdate: user.birthdate ?? '',
            height: parseFloat(user.height).toFixed(2) ?? '',
            bloodtype: user.bloodtype ?? '',
            imc: imc.toFixed(2),
            imcclassification: analysisIMC(imc),
            email: user.email ?? '',
            password: user.password ?? '',
            userCode: 1,
            status: 1,
            created_at: user.created_at ? user.created_at : getDateTime(),
            updated_at: user.updated_at ? user.updated_at : getDateTime(),
        }

        updateData(_user)

        setUser(_user)

       /*  if (imageAvatar !== null) {
            handleUpload()
        } */
    }
}



export const updateData = async (_user) => {

    await docRef
        .update(_user)
        .then(() => {
            toast.success("registro atualizado com sucesso!")
        })
        .catch((error) => {

            toast.error(`erro ao tentar atualizar esse registro - erro: ${error}`)
        })
}



export const fieldsVerify = (user) => {

    let verifyReturn = true

    if (checkFields) {

        if (!user.birthdate) {

            document.getElementById('error_message_birthdate').style.display = "block"
            verifyReturn = false
        }

        if (!user.height) {

            document.getElementById('error_message_height').style.display = "block"
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
                    () => window.location.href = "/",
                    1000
                )
            })
            .catch(error => {
                toast.error(`erro ao tentar deleter esse registro - erro: ${error}`)
            })
    }
}



export const analysisIMC = (imc) => {

    let _resultAnalysis = ""

    if (imc < 18.5) _resultAnalysis = "abaixo do peso"

    else if (imc >= 18.5 && imc <= 24.9) _resultAnalysis = "peso normal"

    else if (imc >= 25 && imc <= 29.9) _resultAnalysis = "acima do peso (sobrepeso)"

    else if (imc >= 30 && imc <= 34.9) _resultAnalysis = "obesidade I"

    else if (imc >= 35 && imc <= 39.9) _resultAnalysis = "obesidade II"

    else if (imc > 40) _resultAnalysis = "obesidade III"

    return _resultAnalysis
}