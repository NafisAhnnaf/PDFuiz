import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import {TimeProgressBar} from 'time-progress-bar';

const Assessment = () => {
    const navigate = useNavigate();
    const [ques, setQues] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [countQ, setCountQ] = useState(0);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setQues(location.state.questions);
        }
    }, [location.state]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        console.log(selectedOption)
        console.log(Date.now().getMinutes)
    };

    const handleNextQuestion = () => {
        setQues((prevQ) => {
            const updatedQues = prevQ.map((q, i) => 
                i === countQ ? { ...q, selectedOpt: selectedOption } : q
            );
    
            if (countQ === updatedQues.length - 1) {
                navigate('/Result', { state: updatedQues });
                return updatedQues;
            }
    
            return updatedQues;
        });
    
        setSelectedOption(null);
        setCountQ((prevCount) => prevCount + 1);
    };
    

    return (
        <div className='flex h-screen bg-gray-900 flex-col justify-center items-center'>
            <div className='fixed top-10 mb-5'>
            <TimeProgressBar
                hourBar="tertiary"
                data={[{ start: "03:25:53", end: "13:06:00", color: "gold" }]}
            />
            </div>
            {ques?.length > 0 && (
                <div className='md:w-[400px]  sm:w-[300px] p-4 text-lg bg-gray-700 rounded-xl text-white'>
                    <h1 className='text-xl mb-4'>{countQ + 1}. {ques[countQ].question}</h1>
                    <ul>
                        {ques[countQ].options.map((option, index) => {
                            const optionLetter = String.fromCharCode(97 + index); // a, b, c, etc.
                            return (
                                <li
                                    onClick={() => handleOptionClick(option)}
                                    className={`mb-2 cursor-pointer pl-3 ${selectedOption === option ? 'bg-blue-500 rounded-xl' : ''}`}
                                    key={option}
                                >
                                    {optionLetter}. {option}
                                </li>
                            );
                        })}
                    </ul>
                    <div className='flex justify-end p-5'>
                        <Button
                            name={"Next"}
                            type={'bg-green-700 my-auto'}
                            func={handleNextQuestion}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assessment;
