import { useEffect, useState } from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Main = () => {

    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, seturl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokedex] = useState();
    let navigator = useNavigate();
    
    const pokeFun = async () => {
        setLoading(true);
        const res = await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results);
        setLoading(false);
    }
    const getPokemon = async (res) => {
        res.map(async (item) => {
            const result = await axios.get(item.url);
            // console.log(result.data);
            setPokeData(state => {
                state = [...state, result.data]
                state.sort((a, b) => a.id > b.id ? 1 : -1)
                return state;
            })
        })
    }
    useEffect(() => {
        pokeFun();
    }, [url]);

    let logout = ()=>{
        localStorage.removeItem("login");
        navigator("/")
    }

    return (
        <div className="main-page">
            <nav>
                <h1>PokéStatsTracker</h1>
                <button onClick={logout}>Logout</button>
            </nav>
            <div className="container">
                <div className="left-content">
                    <Card pokemon={pokeData} 
                          loading={loading} 
                          onClick = {window.scrollTo(0,0)}
                          infoPokemon={poke => { setPokedex(poke) }} />
                    <div className="btn-group">
                        {prevUrl && <button onClick={() => {
                            setPokeData([])
                            seturl(prevUrl)
                        }}>Previous</button>}
                        {nextUrl && <button onClick={() => {
                            setPokeData([])
                            seturl(nextUrl)
                        }}>Next</button>}
                    </div>
                </div>
                <div className="right-content">
                    <Pokeinfo data={pokeDex} />
                </div>
            </div>
        </div>
    );
}

export default Main;