import React, { useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '../Components/Button';
import axios from 'axios';
import pdfpic from '../assets/pdfPic.png';

const api_base = import.meta.env.backend;

const Landing = () => {
    
    const navigate = useNavigate();



    const inputRef = useRef(null);
    const [file, setFile] = useState();
    const [pdfPic, setPdfPic] = useState('');
    const [queType, setQueType] = useState("");
    const [queNos, setQueNos] = useState("");
    const [dur, setDur] = useState("");
    const [fileInfoDisp, setFileInfoDisp] = useState({fileName: "", fileSize: ""});
    let [durations, setDurations] = useState([]);

    const maxSize = 10 * 1024 * 1024;
    
    const [step, setStep] = useState(0);
    const steps = [
        "Upload File",
        "Choose Type of Question",
        "Choose Number of Questions",
        "Choose Question Duration",
        "Submit"
    ];
    const handleFileClick = ()=>{
        inputRef.current.click();
        
    };
    const handleFileSelect = (e)=>{
        const Fl = e.target.files;

        if (!Fl) return; 

        if (Fl[0].type !== "application/pdf") {
            alert("Only PDF files are allowed!");
            e.target.value = ""; // Clear the file input
            return;
        }

        const sz = (Fl[0].size / (1024 * 1024)).toFixed(2); 
        const maxsz = (maxSize / (1024 * 1024)).toString(); 
        const flNm = Fl[0].name;
    
        const flShort = flNm.length > 14 
            ? flNm.slice(0, 6) + "..." + flNm.slice(-8) 
            : flNm;

        if(Fl.length==1){
            if(Fl[0].size<=maxSize){
                setFile(Fl[0]);
                setFileInfoDisp({fileName: flShort, fileSize: (sz)+" MB"});
                setPdfPic(pdfpic);
            } 
            else alert("File Size exceeds "+ maxsz+ " MB");
        }
        else{
            alert("Select a single file");
        }   
            
        
    };
    const handleNext = (e) => {
        e.preventDefault();
        if (step < steps.length - 1) setStep(step + 1);
        if(queType === "standard"){
            durations = ["10m", "20m", "30m"];
        }
        else{
            durations = ["10s", "20s", "30s"];
        }
        setDurations(durations);
    };
    
    const handleBack = (e) => {
        e.preventDefault();
        if (step > 0) setStep(step - 1);
    };
    

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!file || !queType || !queNos || !dur)alert("Please provide necessary Information");
        else{
            const dat = new FormData();
            dat.append("pdfFile", file);
            dat.append("queNos", queNos);
            dat.append("queType", queType);
            dat.append("dur", dur);
            console.log(dat);
            try {
                axios.post(`http://192.168.0.100:8000/upload`, dat, {
                    headers: {'Content-Type': 'multipart/form-data'}
                }).
                then((res)=>console.log(res.data)).
                catch((err)=>console.error(err));

            } catch (err) {
                alert("Error Sumbitting data");
            }
            navigate('/Processing',{state: dur});
        }
    }

    return (
        <div className='text-white flex justify-center items-center h-screen bg-gray-800'>
            <div className='md:h-[300px] md:w-[30%] sm:h-[500px] sm:w-[90%]  bg-slate-900 rounded-xl flex align flex-col gap-6 p-12 justify-center'>
                <form id='pdfForm'>
                    <div className={`space-y-8 ${step===0 ? "block": "hidden"}`}>
                        <h1>Upload File</h1>
                        <div onClick={handleFileClick} className='flex space-x-2 p-4 hover:cursor-pointer rounded-lg border-4 border-dotted border-violet-800 w-full h-24 '>
                            <img src={pdfPic} alt="" />
                            <div className='flex flex-col justify-center items-start '>
                                <h1><span className='text-gray-500'>PDF:  </span> {fileInfoDisp.fileName}</h1>
                                <p><span className='text-gray-500' >Size:  </span>{fileInfoDisp.fileSize}</p>
                            </div>
                            <input ref={inputRef} onChange={handleFileSelect} accept='application/pdf' required className='rounded-lg hidden' type="file" /><br />
                        </div>
                        <div className='flex justify-end'>
                            <Button name="Next" type="bg-violet-800 w-full" func={handleNext} />
                        </div>
                    </div>
                    
                    <div className={` space-y-8 ${step===1 ? "block": "hidden"}`}>
                        <h1>Choose Type of Question</h1>
                        <select 
                        onChange={(e) =>{setQueType(e.target.value);
    
                        setDurations(e.target.value==="standard"? ["10m", "20m", "30m"]:["10s", "20s", "30s"]);
                        }}
                        required 
                        defaultValue="" 
                        className='bg-gray-600 rounded-lg p-2 w-full focus:ring focus:border-blue-500'>
                            <option disabled value="">Select Type</option>
                            <option value="rapidfire">Rapidfire MCQ</option>
                            <option value="standard">Standard MCQ</option>
                            <option value="truefalse">True False</option>
                        </select><br />
                        <div className='flex justify-between self-baseline'>
                            <Button name="Back" type={"bg-violet-800"} func={handleBack} />
                            <Button name="Next" type="bg-violet-800" func={handleNext} />
                        </div>
                    </div>
                    <div className={`space-y-8 ${step===2 ? "block": "hidden"}`}>
                        <h1>Choose Number of Questions to be Generated</h1>
                        <select onChange={(e)=>setQueNos(e.target.value)}  
                        required defaultValue="" 
                        className='bg-gray-600 rounded-lg p-2 w-full focus:ring focus:border-blue-500'>
                            <option disabled value="">Select Number</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </select><br />
                        <div className='flex justify-between'>
                            <Button name="Back" type={"bg-violet-800"} func={handleBack} />
                            <Button name="Next" type="bg-violet-800" func={handleNext} />
                        </div>
                    </div>
                    <div className={`space-y-8 ${step===3 ? "block": "hidden"}`}>
                        <h1>Choose Question Duration</h1>
                        <select onChange={(e)=>setDur(e.target.value)} 
                        required defaultValue="" 
                        className='bg-gray-600 rounded-lg p-2 w-full focus:ring focus:border-blue-500'>
                            <option disabled value="">Select Duration</option>
                            {
                                durations.map((duration)=>(
                                    <option key={duration} value={duration}>{duration}</option>
                                ))
                            }
                        </select><br />
                        <div className='flex justify-between'>
                            <Button name="Back" type={"bg-violet-800"} func={handleBack} />
                            <Button name="Submit" type="bg-violet-800" func={handleSubmit} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Landing;
