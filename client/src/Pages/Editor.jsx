import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Editor = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  console.log(id);
  useEffect(() => {
    const handleGetwebsite = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/api/website/get-by-id/${id}`,
          {
            withCredentials: true,
          },
        );
        console.log(result);
        setWebsite(result.data);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      }
    };
    handleGetwebsite();
  }, [id]);

  if (error) {
    return <div className="">


    </div>;
  }

  return (
    <>
      <div className="">kjhgfc</div>
    </>
  );
};

export default Editor;


// 5.27