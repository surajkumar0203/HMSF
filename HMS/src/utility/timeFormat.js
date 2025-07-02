const convert24To12hour = (time) =>{

    let [hour,minutes,second]=time.split(":").map(Number)
    if(
        !(hour>=0 && hour<24) ||
        !(minutes>=0 && minutes<60) ||
        !(second>=0 && second<60)
    ){
        return "Invalid Time";
    }
    const suffix=hour>=12?'PM':'AM'
    hour=hour%13
    return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2,"0")}:${String(second).padStart(2,"0")} ${suffix}`
   
}

const convert12To24hour = (inputTime) =>{
    
   let [time,meridiem]=inputTime.split(" ")
    let [hour,minutes,second]=time.split(":").map(Number)
    if(
        !(hour>=1 && hour<=12) ||
        !(minutes>=0 && minutes<60) ||
        !(second>=0 && second<60) ||
        !(['AM','PM'].includes(meridiem))
    ){
        return "Invalid Time";
    }
    if(meridiem==='AM' && hour===12)
        hour=0
    
    else if(meridiem==='PM' && hour!==12)
        hour=hour+12
    
   
    return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2,"0")}:${String(second).padStart(2,"0")}`
    
}
export  {convert24To12hour,convert12To24hour}


