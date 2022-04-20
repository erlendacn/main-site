import Head from "next/head";
import { Layout } from "../../components/profile/layout";
import { LayoutPage } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { AgreementList } from "../../components/lists/agreementList/agreementList";
import {
  AvtaleGiroAgreement,
  Distribution,
  Organization,
  VippsAgreement,
} from "../../models";
import { Spinner } from "../../components/elements/spinner";
import { useAuth0, User } from "@auth0/auth0-react";
import {
  useAgreementsDistributions,
  useAvtalegiroAgreements,
  useOrganizations,
  useVippsAgreements,
} from "../../_queries";
import { useContext, useState } from "react";
import { ActivityContext } from "../../components/profile/activityProvider";
import { InfoBox } from "../../components/elements/infobox";
import { Clock } from "react-feather";
import style from "../../styles/Infobox.module.css";
import AgreementsMenu from "../../components/profile/agreements/agreementsMenu";
import styles from "../../styles/Agreements.module.css";

const Agreements: LayoutPage = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { setActivity } = useContext(ActivityContext);
  const [selected, setSelected] = useState<"Aktive avtaler" | "Inaktive avtaler">("Aktive avtaler")

  const {
    loading: avtaleGiroLoading,
    data: avtaleGiro,
    isValidating: avtaleGiroRefreshing,
    error: avtaleGiroError,
  } = useAvtalegiroAgreements(user as User, getAccessTokenSilently);

  const {
    loading: vippsLoading,
    data: vipps,
    isValidating: vippsRefreshing,
    error: vippsError,
  } = useVippsAgreements(user as User, getAccessTokenSilently);

  const {
    loading: organizationsLoading,
    data: organizations,
    isValidating: organizationsRefreshing,
    error: organizationsError,
  } = useOrganizations(user as User, getAccessTokenSilently);

  const kids = new Set<string>();
  if (vipps && avtaleGiro)
    [
      ...vipps?.map((a: VippsAgreement) => a.KID),
      ...avtaleGiro?.map((a: AvtaleGiroAgreement) => a.KID),
    ].map((kid) => kids.add(kid));

  const {
    loading: distributionsLoading,
    data: distributions,
    isValidating: distributionsRefreshing,
    error: distributionsError,
  } = useAgreementsDistributions(
    user as User,
    getAccessTokenSilently,
    !vippsLoading && !avtaleGiroLoading,
    Array.from(kids)
  );

  const loading =
    vippsLoading ||
    avtaleGiroLoading ||
    distributionsLoading ||
    organizationsLoading;

  const refreshing =
    avtaleGiroRefreshing ||
    vippsRefreshing ||
    organizationsRefreshing ||
    distributionsRefreshing;

  if (loading || !organizations || !distributions || !vipps || !avtaleGiro)
    return (
      <>
        <h1>Faste avtaler</h1>
        <Spinner />
      </>
    );

  if (refreshing) setActivity(true);
  else setActivity(false);

  const distributionsMap = getDistributionMap(distributions, organizations);

  const vippsPending = vipps.filter(
    (agreement: VippsAgreement) => agreement.status === "PENDING"
  );
  const pendingCount = vippsPending.length;
  return (
    <>
      <Head>
        <title>Konduit. - Avtaler</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <h1 className={styles.header}>Faste avtaler</h1>

        <AgreementsMenu selected={selected} onChange={(selected) => setSelected(selected)}></AgreementsMenu>

        {
          pendingCount >= 1 ?
          <InfoBox style={style.infoBox}>
            <h2>
              <Clock size={24} color={"black"} />{pendingCount} {pendingCount === 1 ? 'avtale' : 'avtaler'}
              bekreftes
            </h2>
            <p>
              Vi har registrert {pendingCount} {pendingCount === 1 ? 'ny' : 'nye'} avtaler på deg. Bankene bruker
              noen dager på å bekrefte opprettelse før avtalen din blir aktivert.
            </p>
          </InfoBox> :
          null
        }

        {
          window.innerWidth > 900 || selected === "Aktive avtaler" ?
          <AgreementList
            title={"Aktive"}
            vipps={vipps.filter(
              (agreement: VippsAgreement) => agreement.status === "ACTIVE"
            )}
            avtalegiro={avtaleGiro.filter(
              (agreement: AvtaleGiroAgreement) => agreement.active
            )}
            distributions={distributionsMap}
            supplemental={"Dette er dine aktive betalingsavtaler du har med oss"}
          /> :
          null
        }
        
        {
          window.innerWidth > 900 || selected === "Inaktive avtaler" ?
          <AgreementList
            title={"Inaktive"}
            vipps={vipps.filter(
              (agreement: VippsAgreement) => agreement.status !== "ACTIVE"
            )}
            avtalegiro={avtaleGiro.filter(
              (agreement: AvtaleGiroAgreement) => !agreement.active
            )}
            distributions={distributionsMap}
            supplemental={
              "Dette er tidligere faste betalingsavtaler du har hatt med oss, som vi ikke lenger trekker deg for"
            }
          /> :
          null
        }
      </div>
    </>
  );
};

Agreements.layout = Layout;
export default Agreements;

const getDistributionMap = (
  distributions: Distribution[],
  organizations: Organization[]
) => {
  const map = new Map<string, Distribution>();

  for (let i = 0; i < distributions.length; i++) {
    let dist = distributions[i];

    let newDist = {
      kid: "",
      organizations: organizations.map((org) => ({
        id: org.id,
        name: org.name,
        share: "0",
      })),
    };

    for (let j = 0; j < dist.organizations.length; j++) {
      let org = dist.organizations[j];
      let index = newDist.organizations.map((o) => o.id).indexOf(org.id);
      newDist.organizations[index].share = org.share;
    }

    map.set(dist.kid, { ...newDist });
  }

  return map;
};
