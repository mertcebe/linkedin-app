import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const TicTacToe = () => {
    let [num, setNum] = useState(0);

    let boxes = ['box1', 'box2', 'box3', 'box4', 'box5', 'box6', 'box7', 'box8', 'box9'];

    const putXOrOFunc = (box) => {
        setNum(num + 1);
        document.getElementById(box).innerHTML = num % 2 === 0 ? 'X' : 'O';
        document.getElementById(box).value = num % 2 === 0 ? 'X' : 'O';
        document.getElementById(box).disabled = true;
    }

    const startAgain = () => {
        for (let i = 1; i < 10; i++) {
            document.getElementById(`box${i}`).innerHTML = '';
            document.getElementById(`box${i}`).value = i;
            document.getElementById(`box${i}`).disabled = false;
        }
        setNum(0);
    }

    const disabledAll = () => {
        for (let i = 1; i < 10; i++) {
            document.getElementById(`box${i}`).disabled = true;
        }
    }

    const winTheGame = (box1, box2, box3) => {
        document.getElementById(box1).style.color = 'lightGreen';
        document.getElementById(box2).style.color = 'lightGreen';
        document.getElementById(box3).style.color = 'lightGreen';

        setTimeout(() => {
            document.getElementById(box1).style.color = '#000';
            document.getElementById(box2).style.color = '#000';
            document.getElementById(box3).style.color = '#000';
        }, 3000);
    }

    const control = () => {
        let box1 = document.getElementById('box1').value;
        let box2 = document.getElementById('box2').value;
        let box3 = document.getElementById('box3').value;
        let box4 = document.getElementById('box4').value;
        let box5 = document.getElementById('box5').value;
        let box6 = document.getElementById('box6').value;
        let box7 = document.getElementById('box7').value;
        let box8 = document.getElementById('box8').value;
        let box9 = document.getElementById('box9').value;

        let situation = '';

        // 1 2 3
        if (box1 === box2 && box1 === box3) {
            toast.dark(`${box1} kazandi!`);
            disabledAll();
            winTheGame('box1', 'box2', 'box3');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }
        // 1 5 9
        if (box1 === box5 && box1 === box9) {
            toast.dark(`${box1} kazandi!`);
            disabledAll();
            winTheGame('box1', 'box5', 'box9');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }
        // 1 4 7
        if (box1 === box4 && box1 === box7) {
            toast.dark(`${box1} kazandi!`);
            disabledAll();
            winTheGame('box1', 'box4', 'box7');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }

        // 2 5 8
        if (box2 === box5 && box2 === box8) {
            toast.dark(`${box2} kazandi!`);
            disabledAll();
            winTheGame('box2', 'box5', 'box8');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }

        // 3 6 9
        if (box3 === box6 && box3 === box9) {
            toast.dark(`${box3} kazandi!`);
            disabledAll();
            winTheGame('box3', 'box6', 'box9');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }
        // 3 5 7
        if (box3 === box5 && box3 === box7) {
            toast.dark(`${box3} kazandi!`);
            disabledAll();
            winTheGame('box3', 'box5', 'box7');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }

        // 4 5 6
        if (box4 === box5 && box4 === box6) {
            toast.dark(`${box4} kazandi!`);
            disabledAll();
            winTheGame('box4', 'box5', 'box6');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }

        // 7 8 9
        if (box7 === box8 && box7 === box9) {
            toast.dark(`${box7} kazandi!`);
            disabledAll();
            winTheGame('box7', 'box8', 'box9');
            setTimeout(() => {
                startAgain();
            }, 3000);
            situation = 'finish'
        }

        if (num === 9) {
            if (situation === '') {
                toast.dark(`Berabere!`);
                disabledAll();
                setTimeout(() => {
                    startAgain();
                }, 3000);
            }
        }
    }

    useEffect(() => {
        control();
    }, [num]);

    return (
        <div className='container my-3'>
            <button className='btn btn-sm btn-light' onClick={startAgain}>try again</button>
            <div>
                <small>Next player: {num %2 === 0?'X':'O'}</small>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", width: "300px", height: "300px", background: "#fff" }}>
                {
                    boxes.map((box) => {
                        return (
                            <button id={box} value={box} onClick={() => {
                                putXOrOFunc(box)
                            }} style={{ width: "100px", height: "100px", border: "1px solid #000", textAlign: "center", lineHeight: "100px", fontSize: "30px", background: "#fff", color: "#000" }}></button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TicTacToe