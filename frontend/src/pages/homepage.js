
const HomePage = () =>{
    return(
        <div>
            <div className="m-5">
                <a href="/me" className="m-2 btn btn-primary" >My Profile</a>
                <a href="/login" className="m-2 btn btn-warning" >Login</a>
                <a href="/register" className="m-2 btn btn-danger" >Register</a>
            </div>
        </div>
    )
}

export default HomePage;