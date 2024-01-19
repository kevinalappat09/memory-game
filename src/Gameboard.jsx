import { useEffect, useState } from "react";

function Gameboard() {
    const totalCards = 5;
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [currentCards, setCurrentCards] = useState([]);
    const [activeId, setActiveId] = useState([]);
    const [bestScore, setBestScore] = useState(0);

    const setNewActiveCard = (e) => {
        const id = Number(e.currentTarget.getAttribute("data-id"));
        if(activeId.includes(id)) {
            if(score > bestScore) {
                setBestScore(score);
            }
            setGameOver(true);
            setActiveId([]);
            setScore(0);
        } else {
            const newActiveIds = [];
            const usedIndices = [];

            for (let i = 0; i < totalCards-1; i++) {
                let newRandom = Math.floor(Math.random() * totalCards);

                // Ensure that the newRandom index has not been used before
                while (usedIndices.includes(newRandom)) {
                newRandom = Math.floor(Math.random() * totalCards);
                }

                usedIndices.push(newRandom);
                newActiveIds.push(currentCards[newRandom].id);
            }
            setActiveId(newActiveIds);
            setScore(score+1);
        }
        
    }

    const changeGameState = () => {
        setGameOver(false);
    }

    useEffect(() => {
        let isMounted = true;

        if (activeId.length === 0) {
            const getThreeRandomPokemon = async () => {
                const getRandomID = () => Math.floor(Math.random() * 500 + 1);

                const newCards = [];

                for(let i=0; i<totalCards; i++) {

                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomID()}/`);
                    const data = await response.json();
                    const pokemonObject = {
                        id : data.id,
                        name : data.name,
                        imageURL : data.sprites.front_default,
                    }
                    newCards.push(pokemonObject);
                }
                if (isMounted) {
                    setCurrentCards(newCards);
                }
            }

            getThreeRandomPokemon();
        } else {
            const getRandomPokemon = async () => {
                const randomID1 = Math.floor(Math.random() * 500 + 1);

                const lastActivePokemons = [];
                for(let i=0;i<activeId.length; i++) {
                    const lastActiveResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${activeId[i]}/`);
                    const lastActiveData = await lastActiveResponse.json();
                    const lastActiveObject = {
                        id: lastActiveData.id,
                        name : lastActiveData.name,
                        imageURL : lastActiveData.sprites.front_default,
                    }
                    lastActivePokemons.push(lastActiveObject);
                }

                const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID1}/`);
                const data1 = await response1.json();

                const PokemonObject1 = {
                    id: data1.id,
                    name: data1.name,
                    imageURL: data1.sprites.front_default,
                }
                const activeCardPosition = Math.floor(Math.random() * 4);
                const newCards = [lastActivePokemons[0], lastActivePokemons[1], lastActivePokemons[2], lastActivePokemons[3]];
                newCards.splice(activeCardPosition,0,PokemonObject1);

                if (isMounted) {
                    setCurrentCards(newCards);
                }
            }

            getRandomPokemon();
        }

        return () => {
            isMounted = false;
        }

    }, [activeId])

    return (
        gameOver ?
            <div className="gameover">
                <div className="scorecard">Best Score : {bestScore}</div>
                <div className="end-message">Gameover</div>
                <button className="gameover-btn" onClick={changeGameState}>Try Again</button>
            </div> : 
            currentCards.length > 0 ?
                <div className="gameboard">
                    <div className="scorecard">
                        <div className="score">Score : {score}</div>
                        <div className="best-score">Best Score : {bestScore}</div>
                    </div>
                    
                    <div className="card">
                        {currentCards.map((card) => (
                        <div className="card-container" key={card.id} data-id={card.id} onClick={setNewActiveCard}>
                            <div className="card-title" data-id={card.id}>{card.name}</div>
                            <img src={card.imageURL} alt={card.name} className="card-img" data-id={card.id} />
                        </div>
                    ))}
                    </div>
                    
                </div> :
                <div className="gameboard">
                    Loading..
                </div>
    )
}

export default Gameboard;
