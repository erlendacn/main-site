import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { PortableText } from "../lib/sanity";
import { getClient } from "../lib/sanity.server";
import styles from "../styles/Organizations.module.css";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Links } from "../components/main/blocks/Links/Links";
import { SEO } from "../components/shared/seo/Seo";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { Layout } from "../components/main/layout/layout";

const Organizations: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const settings = data.result.settings[0];
  const header = data.result.page[0].header;
  const organizations = data.result.page[0].organizations;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/organizations`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader title={header.title} inngress={header.inngress} links={header.links} />
      <SectionContainer padded={true}>
        <div className={styles.organizationWrapper}>
          {organizations &&
            organizations.map((organization: any) => (
              <div key={organization._id} className={styles.organization}>
                <div className={styles.meta}>
                  <div>
                    <p className="inngress">{organization.name}</p>
                    <p className="inngress">{organization.subtitle}</p>
                  </div>
                  <div className={styles.intervention}>
                    <span className="detailheader">{organization.intervention_type}</span>
                    <h1>{organization.invervention_cost}</h1>
                    <span>{organization.intervention_effect}</span>
                  </div>
                </div>
                <div className={styles.description}>
                  <p className="inngress">{organization.oneliner}</p>
                  <PortableText blocks={organization.content}></PortableText>

                  {organization.links && (
                    <>
                      <p className="inngress">Les mer:</p>
                      <Links links={organization.links} />
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const result = await getClient(preview).fetch(fetchOrganizationsPage);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchOrganizationsPage,
        queryParams: {},
      },
    },
  };
}

const fetchOrganizationsPage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
    main_navigation[] {
      _type == 'navgroup' => {
        _type,
        _key,
        title,
        items[]->{
          title,
          "slug": page->slug.current
        },
      },
      _type != 'navgroup' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
    }
  },
  ${footerQuery}
  "page": *[_type == "organizations"] {
    header {
      ...,
      seoImage{
        asset->
      },
      links[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      }
    },
    organizations[] -> {
      ...
    } 
  }
}
`;

Organizations.layout = Layout;
export default Organizations;
