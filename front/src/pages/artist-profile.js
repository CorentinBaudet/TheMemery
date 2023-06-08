import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Request from "../services/fetchService";
import { Grid, Card, Stack } from "@mui/material";
import getAllArtworkTechnique from "../util/allArtworkTechnique";

const ArtistProfile = () => {
  const [artistArtworks, setArtistArtworks] = useState([]);
  const [firstArtistArtwork, setFirstArtistArtwork] = useState({});
  const location = useLocation();
  const artistToDisplay = location.state.artist;

  async function setup() {
    await Request("/artwork/artist/" + artistToDisplay.id, "GET").then(
      async (response) => {
        await response.json().then((artworks) => {
          setFirstArtistArtwork(artworks[0]);
          artworks.shift();
          setArtistArtworks(artworks);
        });
      }
    );
  }

  useEffect(() => {
    setup();
  }, []);

  return (
    <>
      <Navbar />
      <div className="artist-profile">
        <div className="left">
          <h1>{artistToDisplay.username}</h1>
        </div>
        <div className="right">
          {/* <Grid container spacing={4}> */}

          <div className="last-artwork">
            {/* <Card style={{ width: 330, height: 440 }}>
                  <Stack spacing={2} style={{ margin: 15 }}> */}
            <img item
              className="image"
              src={`data:image/png;base64, ${firstArtistArtwork.image}`}
              style={{ height: 350 }}
            ></img>
            <div item className="text">
              <b className="title">{firstArtistArtwork.title}</b>
              <label className="technique">{getAllArtworkTechnique(firstArtistArtwork.technique)}</label>
            </div>
            {/* </Stack>
            </Card> */}
          </div>

          <div className="grid-container">
            {artistArtworks.map((artwork, index) => {
              const { title, price, technique, image } = artwork;
              return (
                // <Card item key={index} style={{ display: "flex", justifyContent: "center" }}>

                <img
                  src={`data:image/png;base64, ${image}`}
                  className="image"
                ></img>
                //  </Card> 
              );
            })}
          </div>
          {/* </Grid> */}
        </div>
      </div>
    </>
  );

  function FormatPrice(price) {
    return (Math.round(price * 100) / 100).toFixed(2);
  }
};

export default ArtistProfile;
