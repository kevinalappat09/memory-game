import { useEffect, useState } from "react";

function Card({active}) {
  const [currentPokemon, setCurrentPokemon] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const getRandomCard = async () => {
      const randomNumber = Math.floor(Math.random() * 500) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}/`);

      if(!response.ok) {
        throw("Pokemon fetch error");
      }

      const pokeData = await response.json();

      const {id, name, sprites} = pokeData;
      const pokemonObject = {
        id,
        name,
        imageURL : sprites.front_default,
      }
      
      if(isMounted) {
        setCurrentPokemon(pokemonObject);
      }
    }
    getRandomCard();

    return () => {
      isMounted = false;
    }
  }, []); 

  return (
    currentPokemon ?
    <div className="card">
      <h1>{currentPokemon.name}</h1>
      <img src={currentPokemon.imageURL} />
    </div> :
    <div>
      Loading
    </div>
  )
}

export default Card;