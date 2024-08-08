function Notification ({msg}){

    if(msg==null){
        return
    }
    let classN=msg.includes('success')?'success':'error'

    return(
        <div className={classN}>
            {msg}
        </div>
    )
}

export default Notification