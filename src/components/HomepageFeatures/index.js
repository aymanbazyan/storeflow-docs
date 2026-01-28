import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Powerful Admin Panel",
    Svg: require("@site/static/img/analytics.svg").default,
    description: (
      <>
        Manage products, categories, sales, promotions, theme colors, and more
        from a single, feature-rich, optimized admin panel.
      </>
    ),
  },
  {
    title: "Modern User Experience",
    Svg: require("@site/static/img/modern-desktop-computer.svg").default,
    description: (
      <>
        Built with Next.js, Storeflow has a quick, beautiful interface with
        advanced search, filtering, and sorting to help customers find products
        easily.
      </>
    ),
  },
  {
    title: "Secure and Robust",
    Svg: require("@site/static/img/security.svg").default,
    description: (
      <>
        Storeflow secures your data with HS256 encryption, a reliable PostgreSQL
        database, secure authentication, and spammer IP blocking.
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
