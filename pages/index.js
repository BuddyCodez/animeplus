import axios from "axios";
import Head from "next/head";
import Hero from "./components/Hero";
import TopRated from "./components/TopRated";
import Layout from "./layout/main";
export default function Home({ popular }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>

        <title>Animeterra</title>
        <meta name="google-site-verification" content="d8Q9bSGyoBL8RSathwiLAJd3qbQhUcl_au7udJd5XZo" />
      </Head>
      <Layout>
        <article>
          <Hero />
          <TopRated popular={popular} />
        </article>
      </Layout>
    </>
  );
}
export async function getStaticProps() {
  const res = await axios.get("https://api.consumet.org/meta/anilist/popular", {
    headers: {
      Accept: "application/json",
      "User-Agent": "axios 0.21.1"
    }
  });
  const popular = res.data;
  return {
    props: {
      popular,
    },

  };
}
