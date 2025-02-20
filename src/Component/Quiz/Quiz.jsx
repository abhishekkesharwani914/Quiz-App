import React from "react";
import { useState, useRef,useEffect } from "react";
import "./Quiz.css"
import {MCQS} from "../../assets/mcqsQue.js"
import { integerQue } from "../../assets/integerQue.js";
import TextField from '@mui/material/TextField';

function Quiz() {   
    let [index, setIndex] = useState(0);
    let [integerQueIndex, setIntegerQueIndex] = useState(0);
    let [integerQuestion, setIntegerQuestion] = useState(integerQue[integerQueIndex]);
    let [mcqsQuestion, setMcqsQuestion] = useState(MCQS[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [integerScore, setIntegerScore] = useState(0);
    let [result, setResult] = useState(false);
    let [showIntegerQue, setShowIntegerQue] = useState(false);
    let [inputValue, setInputValue] = useState('');
    let [seconds, setSeconds] = useState(30);
    let [isRunning, setIsRunning] = useState(true);
    let intervalRef = useRef(null);     

    useEffect(() => {
        if (isRunning) {
        intervalRef.current = setInterval(() => {
            setSeconds((prevSeconds) => {
            if (prevSeconds <= 0) {
                clearInterval(intervalRef.current);
                setIsRunning(false);
                setLock(true);
                return 0;
            }
            return prevSeconds - 1;
            });
        }, 1000);
        } else {
        clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning,integerQuestion,mcqsQuestion]);

    let optA = useRef(null);
    let optB = useRef(null);
    let optC = useRef(null);
    let optD = useRef(null);

    let opt_arr = [optA, optB, optC, optD];

    //MCQS Answer Check
    const checkAns = (e, ans) => {
        if (!lock) {
            if (ans === mcqsQuestion.ans) {
                e.target.classList.add("Correct");
                setLock(true);
                setScore(score + 1);
            } else {
                e.target.classList.add("Incorrect");
                setLock(true); 
                opt_arr[mcqsQuestion.ans-1].current.classList.add("Correct");
            }
        }
    }

    //MCQS submit handler
    const handleSubmit = (e) => {
        if (lock) {
            if (index === MCQS.length-1) {
                setShowIntegerQue(true);
                return 0;
            }
            setIndex(++index);
            setMcqsQuestion(MCQS[index]);
            setLock(false);
            setSeconds(30);
            setIsRunning(true);
            opt_arr.map((option) => {
                option.current.classList.remove("Incorrect");
                option.current.classList.remove("Correct");
                return null;
            })
        }
    }

    //Integer Answer Check
    const handleChange = (event) => {
        setInputValue(event.target.value);
        if (!lock) {
            if (event.target.value === integerQuestion.ans) {
                setLock(true);
                setIntegerScore(integerScore + 1);
            } else {
                setLock(true);
            }
        }
        
    };
    
    //Integer submit handler
    const handleIntegerSubmit = (e) => {
        if (lock) {
            if (integerQueIndex === integerQue.length-1) {
                setResult(true);
                return 0;
            }
            setIntegerQueIndex(++integerQueIndex);
            setIntegerQuestion(integerQue[integerQueIndex]);
            setLock(false);
            setSeconds(30);
            setIsRunning(true);
            setInputValue('');
        }
    }

    //Restart the quiz
    const restart = () => {
        setIndex(0);
        setMcqsQuestion(MCQS[0]);
        setLock(false);
        setScore(0);
        setResult(false);
        setIntegerQueIndex(0);
        setIntegerQuestion(integerQue[0]);
        setShowIntegerQue(false);

    }

  return (
    <div className="container">
        <h1>Quiz App</h1>
        <hr />
        {result? <></> : showIntegerQue?<>
            <span>Time remaining: {seconds}</span>
            <h2>{integerQueIndex+6}. {integerQuestion.que}</h2>
            <TextField id="standard-basic" label="Standard" variant="standard" value={inputValue} onChange={handleChange} />
            <button onClick={handleIntegerSubmit}>Next</button>
            <div className="index">{integerQueIndex+6} of {MCQS.length + integerQue.length} Question</div>
        
        </>:<>
            <span>Time remaining: {seconds}</span>
            <h2>{index+1}. {mcqsQuestion.que}</h2>
        <ul>
            <li ref={optA} onClick={(e) => {checkAns(e,"A")}}>{mcqsQuestion.opts.A}</li>
            <li ref={optB} onClick={(e) => {checkAns(e,"B")}}>{mcqsQuestion.opts.B}</li>
            <li ref={optC} onClick={(e) => {checkAns(e,"C")}}>{mcqsQuestion.opts.C}</li>
            <li ref={optD} onClick={(e) => {checkAns(e,"D")}}>{mcqsQuestion.opts.D}</li>
        </ul>
        <button onClick={handleSubmit}>Next</button>
        <div className="index">{index+1} of {MCQS.length + integerQue.length} Question</div>
        </>}
        {result? <>
        <h2>You scored {score + integerScore} out of {MCQS.length + integerQue.length}</h2>
        <button onClick={restart}>Restart</button>
        </>:<></>}
        

    </div>
  )
};

export default Quiz;