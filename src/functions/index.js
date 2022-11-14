export const getCode = (codeLength = 5, prefix = '', sufix = '') => {

    const characters = '0123456789abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let code = ''

    for (let i = 0; i < codeLength; i++)
        code = code + characters.substr(getRandomIntNumber(0, characters.length), 1)

    if (prefix !== '') code = prefix + code

    if (sufix !== '') code = code + sufix

    return code

}



export const putOneZeroOnTheLeftSide = (string) => {

    return ("00" + string).substr(-2, 2)
}



export const getDateTime = (insertTime = true) => {

    let today = new Date()
    let date = today.getFullYear() + '-' + putOneZeroOnTheLeftSide((today.getMonth() + 1)) + '-' + putOneZeroOnTheLeftSide(today.getDate())
    if (insertTime) date += " " + putOneZeroOnTheLeftSide(today.getHours()) + ":" + putOneZeroOnTheLeftSide(today.getMinutes()) + ":" + putOneZeroOnTheLeftSide(today.getSeconds())

    return date
}


export const getRandomIntNumber = (min, max) => {

    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min

} 


export const timeCalculation = (start, end) => {

    // todo

    return parseFloat("0").toFixed(2) 
}