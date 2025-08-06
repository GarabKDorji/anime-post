import {React, useState} from "react"
import './Create.css'
import { supabase } from '../client'

const Create = () => {
    const [post,setPost] = useState({
        title: "",
        content: "",
        img_url: "",
        name : "",
        img_file: null,
    }) 
    const handleChange = (e)=>{
        const {name, value} = e.target
        setPost((prev)=> ({ ...prev, [name]:value}))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        let imageToStore = "";
        const wordCount = post.content.trim().split(/\s+/).length;
        if (wordCount < 25) {
            alert("Content must be at least 25 words.");
            return;
        }
        if (post.img_file) {
            const filePath = `public/${Date.now()}_${post.img_file.name}`;

            const { data, error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, post.img_file);

            if (uploadError) {
                console.error("Upload error:", uploadError.message);
                alert("Image upload failed.");
                return;
            }
            const {
                data: { publicUrl },
            } = supabase.storage.from("images").getPublicUrl(filePath);

            imageToStore = publicUrl;
        } else {
            imageToStore = post.img_url;
        }
        const { error } = await supabase
        .from('anime_posts')
        .insert({title: post.title, content: post.content, name:post.name, up_votes: 0, img: imageToStore})
        window.location = "/";

    }
    return (
        <form onSubmit={handleSubmit} >
            <input name ="title" type="text" placeholder="Title" required value={post.title} onChange={handleChange}/>
            <textarea name="content" placeholder="Content (minimum 50 words)" value={post.content} onChange={handleChange}></textarea>
            <input name= "img_url" type="url" placeholder="Image URL (optional) "  value={post.img_url} onChange={handleChange} disabled={post.img_file !== null}/>
            <input name="img_file" type="file" accept="image/*"  onChange={(e)=>{setPost((prev)=>({...prev,img_file: e.target.files[0] }))}}   disabled={post.img_url !== ""}/>
            <input type="text" name="name" placeholder="your name" required value={post.name}  onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    )
}

export default Create