import { useEffect, useState } from "react";
import React from 'react'
import axios from 'axios'


function Home() {
    
    
    const [file, setFile] = useState ()

    const handleUpload = (e) => {
        const formdata = new FormData()
        formdata.append('file', file)
        axios.post('http://localhost:3001/home', formdata )
        .then(res => console.log(res))
        .catch(err => console.log(err))          
    }

    useEffect(() => {
        axios.get('http://localhost:3001/getfile')
        .then(res => setFile(res.data[0].file))
        .catch(err => console.log(err))
    }, [])

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100" >
        <div>
        <form >
            <h2>
                Dashboard
            </h2>
            <div className="mb-3">
                        <label htmlFor="email">
                            <strong>File Upload</strong>
                        </label>
                        <input
                            type="file"
                            placeholder="Upload File"
                            autocomplete="off"
                            name="file"
                            className="form-control rounded-0"
                            onChange={(e) => setFile(e.target.files[0])}
                            
                        />
            </div>
            <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Phone Number</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Phone Number"
                            autocomplete="off"
                            name="phonenumber"
                            className="form-control rounded-0"
                            onChange={(e) => setPhonenumber(e.target.value)}
                            
                        />
            </div>
            <button onClick={handleUpload} className="btn btn-success w-100 rounded-0" >Upload File</button>
            <br />
            <file src={`http://localhost:3001/files/` +file} alt="" />
        </form>
        </div>
        </div>
    )
}

export default Home;