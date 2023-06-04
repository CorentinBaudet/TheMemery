import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import APIRequest from "../services/fetchService";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Unstable_Grid2";
import styled from "styled-components";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const navigateTo = useNavigate();
  const [areImagesDisplayed, setAreImagesDisplayed] = useState(false);
  const [img, setImg] = useState([]);

  const toArtistProfile = (selectedArtist) => {
    navigateTo(`/artists/${toURLFormat(selectedArtist.username)}`, {
      state: {
        artist: selectedArtist,
      },
    });
  };

  const toURLFormat = (string) => {
    string = string.toLowerCase();
    return string.replaceAll(" ", "_");
  };

  const getArtworksFromArtist = async (id) => {
    await APIRequest(`/artwork/artist/${id}`, "GET").then(async (response) => {
      await response.json().then((artworks) => {
        console.log(artworks);
        setImg(artworks);
      });
    });
  };

  async function setup() {
    await APIRequest("/user", "GET").then(async (response) => {
      await response.json().then((allUsers) => {
        allUsers.forEach((user) => {
          if (user.role === "ROLE_ARTIST") {
            setArtists((previousState) => [...previousState, user]);
          }
        });
      });
    });
  }

  useEffect(() => {
    setup();
  }, []);

  return (
    <>
      <Navbar />
      <Grid container style={{ marginTop: 50 }}>
        <Grid xs={5}>
          <List style={{ marginLeft: 100 }}>
            {artists.map((artist, index) => {
              const { id, username } = artist;
              return (
                <ListItem disablePadding key={index}>
                  <MySpan>
                    <ListItemText
                      style={{ cursor: "pointer" }}
                      primary={username}
                      onClick={() => {
                        toArtistProfile(artist);
                      }}
                      onMouseEnter={() => {
                        // afficher ses oeuvres sur la droite
                        // mettre un placeholder le temps du chargement
                        if (!areImagesDisplayed) {
                          getArtworksFromArtist(id);
                        }
                        setAreImagesDisplayed(true);
                      }}
                      onMouseLeave={() => {
                        // cacher ses oeuvres
                        setAreImagesDisplayed(false);
                        setImg([]);
                      }}
                    />
                  </MySpan>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid xs={7} justifyContent="center">
          {/* sx={{ width: 500, height: 450 }} rowHeight={164} parameters for ImageList */}
          <ImageList cols={3} style={{ marginRight: 100 }}>
            {img.map((artwork, index) => (
              <ImageListItem key={index}>
                <img
                  src={`data:image/png;base64, ${artwork.image}`}
                  // srcSet={`data:image/png;base64, ${artwork.image}`}
                  loading="eager"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
      </Grid>
    </>
  );
};

const MySpan = styled.span`
  &:hover {
    text-decoration: underline;
  }
`;

export default Artists;
