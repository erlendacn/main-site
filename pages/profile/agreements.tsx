import Head from "next/head";
import { Layout } from "../../components/profile/layout";
import { ProfileInfo } from "../../components/profile/profileInfo";
import { DataInfo } from "../../components/profile/dataInfo";
import style from "../../styles/Profile.module.css";
import { LayoutPage } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";

const Agreements: LayoutPage = () => {
  return (
    <>
      <Head>
        <title>Avtaler</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Faste avtaler</h1>
      </div>
    </>
  );
};

Agreements.layout = Layout;
export default Agreements;
