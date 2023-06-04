import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import APIRequest from "../services/fetchService";
import { Grid, Card, Stack } from "@mui/material";
import getAllArtworkTechnique from "../util/allArtworkTechnique";

const ArtistProfile = () => {
  const [artistArtworks, setArtistArtworks] = useState([]);
  const location = useLocation();
  const artistToDisplay = location.state.artist;

  useEffect(() => {
    async function setup() {
      await APIRequest("/artwork/artist/" + artistToDisplay.id, "GET").then(
        async (response) => {
          await response.json().then((artworks) => {
            setArtistArtworks(artworks);
          });
        }
      );
    }
    setup();
  }, []);

  return (
    <>
      <Navbar />
      <h1>{artistToDisplay.username}</h1>
      <Grid container spacing={4}>
        {artistArtworks.map((artwork, index) => {
          const { title, price, technique, image } = artwork;
          return (
            <Grid item key={index}>
              <Card style={{ width: 330, height: 440 }}>
                <Stack spacing={2} style={{ margin: 15 }}>
                  <img
                    src={`data:image/png;base64, ${image}`}
                    style={{ maxWidth: 300, maxHeight: 300 }}
                  ></img>
                  <label>
                    <b>{title}</b>
                  </label>
                  <label>{getAllArtworkTechnique(technique)}</label>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );

  function FormatPrice(price) {
    return (Math.round(price * 100) / 100).toFixed(2);
  }
};

export default ArtistProfile;
