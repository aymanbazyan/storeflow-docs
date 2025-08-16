import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Powerful Admin Panel",
    Svg: require("@site/static/img/analytics.svg").default,
    description: (
      <>
        Storeflow includes a feature-rich admin panel for effortless management.
        Adjust products, categories, sales, promotions, and even theme colors in
        one central dashboard.
      </>
    ),
  },
  {
    title: "Modern User Experience",
    Svg: require("@site/static/img/modern-desktop-computer.svg").default,
    description: (
      <>
        Built with Next.js, Storeflow offers a beautiful, performant and simple
        interface. It features an advanced search, filter, and sort menu to help
        customers find exactly what they need.
      </>
    ),
  },
  {
    title: "Secure and Robust",
    Svg: require("@site/static/img/security.svg").default,
    description: (
      <>
        Using a PostgreSQL database for reliability, bcryptjs for encryption,
        Storeflow ensures your data is safe. It has secure authentication and
        administrative privileges to protect your store and operations, and a
        timeout panel for spammers' IPs.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
