const isDoctorAvailable = (date,startDate,endDate) => {
    let fromLeave = new Date(startDate)
    let endLeave = new Date(endDate)
    let data = new Date(date)
    // console.log("fromLeave : ",fromLeave)
    // console.log("endLeave : ",endLeave)
    // console.log("data : ",data)
    if(isNaN(data) || isNaN(fromLeave) || isNaN(endLeave))
        return 'Invalid Date'
    
    if (fromLeave <= data && endLeave >= data) 
        return "Doctor Not Avilable"
    else 
        return "Doctor Is Avilable"
    

}

export default isDoctorAvailable