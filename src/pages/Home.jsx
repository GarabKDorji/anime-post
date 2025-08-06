import React, { useEffect, useState } from "react";
import { supabase } from '../client';
import Card from "../component/card";

const Home = ({input})=>{
    const [loading, setLoading] = useState(true)
    const [posts,setPosts] = useState("")
    const filteredPosts = [...posts]
        .filter((post) =>
            post.title?.toLowerCase().includes(input?.toLowerCase() || "")
        )
        .sort((a, b) => b.id - a.id);

    useEffect(() => {
    const fetchCharacters = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('anime_posts')
            .select()
            .order('created_at', { ascending: true });

        if (error) {
        console.error("Error fetching characters:", error.message);
        } else {
        setPosts(data);
        console.log("Characters:", data);
        }
        setLoading(false); 
    };

    fetchCharacters();
    }, [])
    return( 
       <>
        {loading ?  
            <h1>Loading...</h1>
        : 
            <>
                {filteredPosts.map((post) => (
                    <Card
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    img={post.img}
                    time={post.created_at}
                    upVote={post.up_votes} 
                    name ={post.name}
                    />
                ))}
            </>

        }
       </>
    )
}

export default Home