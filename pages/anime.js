import Link from "next/link";
import Layout from "./layout/main";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsPlayBtn, BsPlayCircle } from "react-icons/bs";
import { Tabs } from "flowbite";
import { Card, Grid, Row, Text } from "@nextui-org/react";
const Anime = ({ data, dub }) => {
  const { query } = useRouter();
  const anime = data;
  const [episodes, setEpisodes] = useState(anime.episodes);
  const [mode, setMode] = useState("dub");
  function HandleInputSearch(element) {
    if (!element.target.value) return setEpisodes(data.episodes);
    let FilteredEp = []
    FilteredEp = anime.episodes.filter((e) => {
      return e.title.toLowerCase().includes(element.target.value);
    })
    setEpisodes(FilteredEp);
  }
  useEffect(() => {
    if (anime) {
      const movieDetail = document.querySelector(".movie-detail");
      movieDetail.style.background = `url(${anime?.cover}) no-repeat`;
      movieDetail.style.backgroundSize = 'cover';

    }
  }, []);
  useEffect(() => {
    const tabElements = [
      {
        id: 'sub',
        triggerEl: document.querySelector('#sub-tab'),
        targetEl: document.querySelector('#sub')
      },
      {
        id: 'dub',
        triggerEl: document.querySelector('#dub-tab'),
        targetEl: document.querySelector('#dub')
      },
    ];
    const options = {
      defaultTabId: 'sub',
      activeClasses: 'text-info hover:text-info dark:text-info-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500',
      inactiveClasses: 'text-gray-300 hover:text-gray-400 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
    };
    // const tabs = new Tabs(tabElements, options);

  }, [])
  return (
    <Layout>
      <main>
        {anime?.id ?
          (<article>
            <section className="movie-detail">
              <div className="container">
                <figure className="movie-detail-banner">
                  <img src={anime?.image} alt={anime?.title} />

                </figure>

                <div className="movie-detail-content">
                  <p className="detail-subtitle">
                    {anime?.totalEpisodes} Episodes
                  </p>

                  <h1 className="h1 detail-title">
                    <strong>{anime?.title?.english}</strong>
                  </h1>


                  <div className="meta-wrapper">
                    <div className="badge-wrapper">
                      <div className="badge badge-fill">{anime?.status}</div>
                      {anime?.duration ? (<div className="badge badge-info">
                        {anime?.duration} Min
                      </div>) : ""}

                      <div className="badge badge-outline badge-info">HD</div>
                    </div>

                    <div className="ganre-wrapper">
                      {anime?.genres?.map((genre) => {
                        return <span class="bg-transparent border border-info text-info text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 hover:bg-info transition-all hover:text-black cursor-pointer" >{genre}</span>
                      })}

                    </div>

                    <div className="date-time">
                      <div>
                        <ion-icon name="calendar-outline"></ion-icon>

                        <time dateTime={anime?.releaseDate}>
                          Release Date: {anime?.releaseDate}
                        </time>
                      </div>
                    </div>
                  </div>

                  <p className="storyline">{String(anime?.description).replace("<br>", "\n").replace("(Source: Crunchyroll)", "Source => AnimeTronix")}</p>
                </div>
              </div>
            </section>
            <section className="tv-series">
              <div className="container">
                <label className="relative inline-flex items-center cursor-pointer text-info">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked={dub ? true : false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMode("dub");
                      } else {
                        setMode("sub");
                      }
                    }} />

                  <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-info " ></div>
                  <span className="ml-3 text-sm font-medium">{dub ? "Dub Mode" : "Sub Mode"}</span>
                </label>
                <div className="relative overflow-hidden sm:rounded-lg ">
                  <EpisodeView episodes={episodes} mode={mode} anime={anime} dub={dub} />
                </div>




              </div>
            </section>
            <Recommendations recommendations={anime?.recommendations} />
          </article>) : (
            <>
              <h1>No Anime Found or Server may be down.</h1>
            </>
          )
        }
      </main >
    </Layout >
  );
};
export default Anime;
export async function getServerSideProps(context) {
  const { query } = context;
  let data;
  let dubAvailable = false;

  try {
    if (query?.animeid) {
      const url = "https://api.consumet.org/meta/anilist/info/" + query.animeid + "?provider=gogoanime";
      console.log("URL", url);
      const res = await fetch(url);
      data = await res.json();
      console.log("Logs", data);
      const episodeId = data.episodes[0].id.split("-episode")
      const episodeUrl = episodeId[0] + "-dub-episode" + episodeId[1]
      console.log(episodeUrl)
      let duburl;
      try {
        duburl = "https://api.consumet.org/anime/gogoanime/watch/" + episodeUrl;
        const res = await fetch(duburl);
        if (res.status == 200) {
          dubAvailable = true;
        }
      } catch (e) {
        duburl = "";
        dubAvailable = false
      }
    } else {
      const url = "https://api.consumet.org/anime/gogoanime/info/" + query.anime;
      const res = await fetch(url);
      data = await res.json();

    }

  } catch (e) {
    console.log(e);
    data = [];
  }
  // console.log(data);
  return {
    props: {
      data,
      dub: dubAvailable
    },
  };
}
const EpisodeView = ({ episodes, dub, anime, mode }) => {
  const router = useRouter();
  return (


    <Grid.Container gap={2} justify="flex-start" style={{ overflowY: 'hidden' }}>
      {episodes.map((ep, index) => {
        const epid = ep.id.split("-episode");
        const id = epid[0] + "-dub-episode" + epid[1];
        if (!ep || episodes.length === 0) return "No Episodes Found!";
        return (
          <Grid xs={6} sm={3} key={index}>
            <Card isPressable variant="bordered" color="primary"
              onPress={() => {
                router.push(`/watch?id=${dub && mode == "dub" ? id : ep.id}&anime=${anime.id}`);
              }}
            >
              <Card.Body css={{ p: 0 }}>
                <Card.Image
                  src={ep.image}
                  objectFit="cover"
                  width="100%"
                  height={140}
                  alt={ep.title}
                  showSkeleton={true}
                />
              </Card.Body>
              <Card.Footer css={{ justifyItems: "flex-start" }} isBlurred={true}>
                <Row wrap="wrap" justify="space-between" align="center">
                  <Text b>{ep.title}</Text>
                  <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                    Air Date: {new Date(ep.airDate).toLocaleDateString(
                      "en-US",
                      {

                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      }
                    )}
                  </Text>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>
        )
      })}
    </Grid.Container>
  );
};


const Recommendations = ({ recommendations }) => {
  return (
    <>
      <section className="tv-series">
        <div className="container">

          <p className="section-subtitle">Recommendations</p>

          <h2 className="h2 section-title">Recommended Animes</h2>

          <ul className="movies-list">

            {recommendations?.map((anime) => {
              return (
                <li>
                  <div className="movie-card" key={anime.id}>

                    <Link href={`/anime?animeid=${anime.id}`}>
                      <figure className="card-banner">
                        <img src={anime.image} alt={anime.title.english} />
                      </figure>
                    </Link>

                    <div className="title-wrapper">
                      <Link href={`/anime?animeid=${anime.id}`}>
                        <h3 className="card-title">{anime.title.english}</h3>
                      </Link>

                      <time dateTime={anime.episodes}>{anime.episodes} episodes</time>
                    </div>

                    <div className="card-meta">
                      <div className="badge badge-outline hover:bg-info hover:text-black cursor-pointer">{anime.status.toUpperCase()}</div>

                      <div className="duration">
                        <time dateTime="PT47M">{anime.type == "TV" ? "SERIES" : anime.type}</time>
                      </div>

                      <div className="rating">
                        <ion-icon name="star"></ion-icon>

                        <data>{anime.rating / 10}</data>
                      </div>
                    </div>

                  </div>
                </li>
              )
            })}

          </ul>

        </div>
      </section>
    </>
  );
}