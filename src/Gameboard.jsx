import { useEffect, useState } from "react";

function Gameboard() {
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [currentCards, setCurrentCards] = useState([]);
    const [activeId, setActiveId] = useState(0);

    const setNewActiveCard = (e) => {
        const id = Number(e.currentTarget.getAttribute("data-id"));
        if(id === activeId) {
            setGameOver(true);
        } else {
            setActiveId(id);
            setScore(score+1);
        }
    }

    useEffect(() => {
        let isMounted = true;

        if (activeId === 0) {
            const getThreeRandomPokemon = async () => {
                const getRandomID = () => Math.floor(Math.random() * 500 + 1);

                const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomID()}/`);
                const data1 = await response1.json();

                const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomID()}/`);
                const data2 = await response2.json();

                const response3 = await fetch(`https://pokeapi.co/api/v2/pokemon/${getRandomID()}/`);
                const data3 = await response3.json();

                const PokemonObject1 = {
                    id: data1.id,
                    name: data1.name,
                    imageURL: data1.sprites.front_default,
                }

                const PokemonObject2 = {
                    id: data2.id,
                    name: data2.name,
                    imageURL: data2.sprites.front_default,
                }

                const PokemonObject3 = {
                    id: data3.id,
                    name: data3.name,
                    imageURL: data3.sprites.front_default,
                }

                const newCards = [PokemonObject1, PokemonObject2, PokemonObject3];

                if (isMounted) {
                    setCurrentCards(newCards);
                }
            }

            getThreeRandomPokemon();
        } else {
            const getTwoRandomPokemon = async () => {
                const randomID1 = Math.floor(Math.random() * 500 + 1);
                const randomID2 = Math.floor(Math.random() * 500 + 1);

                const lastActiveResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${activeId}/`);
                const lastActiveData = await lastActiveResponse.json();

                const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID1}/`);
                const data1 = await response1.json();

                const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID2}/`);
                const data2 = await response2.json();

                const lastActiveObject = {
                    id: lastActiveData.id,
                    name : lastActiveData.name,
                    imageURL : lastActiveData.sprites.front_default,
                }

                const PokemonObject1 = {
                    id: data1.id,
                    name: data1.name,
                    imageURL: data1.sprites.front_default,
                }

                const PokemonObject2 = {
                    id: data2.id,
                    name: data2.name,
                    imageURL: data2.sprites.front_default,
                }


                const activeCardPosition = Math.floor(Math.random() * 2);
                const newCards = [PokemonObject1, PokemonObject2];
                newCards.splice(activeCardPosition,0,lastActiveObject);

                if (isMounted) {
                    setCurrentCards(newCards);
                }
            }

            getTwoRandomPokemon();
        }

        return () => {
            isMounted = false;
        }

    }, [activeId])

    return (
        gameOver ?
            <div>
                Gameover. Reload the website to try again.
            </div> : 
            currentCards.length > 0 ?
                <div className="gameboard">
                    <div className="score">{score}</div>
                    {currentCards.map((card) => (
                        <div className="card-container" key={card.id} data-id={card.id} onClick={setNewActiveCard}>
                            <div className="card" data-id={card.id}>{card.name}</div>
                            <img src={card.imageURL} alt={card.name} data-id={card.id} />
                        </div>
                    ))}
                </div> :
                <div className="gameboard">
                    Meow
                </div>
    )
}

export default Gameboard;