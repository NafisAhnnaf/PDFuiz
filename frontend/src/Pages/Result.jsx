import { React, useState, useEffect } from 'react';
//import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
    // const navigate = useNavigate();
    // const location = useLocation();

    const [ques, setQues] = useState([]);
    const [correct, setCorrect] = useState(0);
    const [notANSWERED, setNotAnswered] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [answer, setAnswers] = useState([]);

    const corrOpt = 'bg-green-800';
    const incorrOpt = 'bg-red-800';

    useEffect(() => {
        // Retrieve answers script from localStorage and parse it
        const storedAnswers = localStorage.getItem('AnswerScript');
        if (storedAnswers) {
            setQues(JSON.parse(storedAnswers));  // Parse string back to array
        }
    }, []);

    useEffect(() => {
        if (ques.length > 0) {
            let correctCount = 0;
            let notAnsweredCount = 0;
            let incorrectCount = 0;
            let answersArr = [];
            
            for (let i = 0; i < ques.length; i++) {
                if (ques[i].selectedOpt === ques[i].answer) {
                    correctCount++;
                    answersArr.push('Correct');
                } else if (ques[i].selectedOpt === null) {
                    notAnsweredCount++;
                    answersArr.push('Not Answered');
                } else {
                    incorrectCount++;
                    answersArr.push('Incorrect');
                }
            }
            setCorrect(correctCount);
            setNotAnswered(notAnsweredCount);
            setIncorrect(incorrectCount);
            setAnswers(answersArr);
        }
    }, [ques]);

    const handleOptColor = (index) => {
        if (answer[index] === 'Correct') {
            return corrOpt;
        } else if (answer[index] === 'Incorrect') {
            return incorrOpt;
        }
        return '';  // For unanswered questions
    };

    return (
        <div className=' bg-slate-900 text-white p-4'>
            <div className='w-full flex gap-4 justify-center'>
                <div>Correct: {correct}</div>
                <div>Not Answered: {notANSWERED}</div>
                <div>Incorrect: {incorrect}</div>
            </div>
            <div className='flex justify-center gap-12 flex-wrap '>
                {ques?.map((q, index) => (
                    <div key={index} className='text-lg rounded-xl md:h-[500px] px-6 py-16 md:w-[30%] bg-gray-700'>
                        <h6>{answer[index]}</h6>
                        <h1 className='mb-10'>{index + 1}. {q?.question}</h1>
                        <ul>
                            {q?.options?.map((op, ind) => (
                                <li
                                    className={`${handleOptColor(index)} rounded-lg px-3 py-2 m-2`}
                                    key={ind}
                                >
                                    {String.fromCharCode(ind + 97)}. {op}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Result;