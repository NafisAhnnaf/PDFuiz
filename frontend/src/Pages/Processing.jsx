import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

const backend = import.meta.env.VITE_BACKEND_URL;


const Processing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(true);
    const [ques, setQues] = useState({});
    const api = import.meta.env.backend;

    const handleProcessing = async () => {
        setIsProcessing(true);
        try {
            const res = await axios.get(`${backend}/getQues`, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(res.data);
            setQues(res.data);
        } catch (err) {
            console.error("Error Getting data: ", err);
        }
        setIsProcessing(false);
    };

    useEffect(() => {
        handleProcessing();
    }, []);

    useEffect(() => {
        if (!isProcessing && Object.keys(ques).length > 0) {
            navigate(`/Assessment`, { state: ques });
        }
    }, [isProcessing, ques]);

    return (
        <div className='flex space-y-10 flex-col justify-center h-screen items-center'>
            <HashLoader
                color={'#00f'}
                loading={true}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <h1>Please wait, your Assessment is on the way</h1>
        </div>
    );
};

export default Processing;
