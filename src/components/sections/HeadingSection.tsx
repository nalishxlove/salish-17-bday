import "@/styles/Heading.css"
import balloons from "@/assets/birthday-balloons.png";

const HeadingSection = () => (
  <section className="birthday-heading">
    <h1>
      Happy birthday,
      <br />
      <span>
        Salish
        <svg viewBox="0 0 330 18" aria-hidden="true">
          <path d="M4 12 Q140 -2 326 9" />
        </svg>
      </span>
      <span className="heading-heart">♡</span>
    </h1>
    <p>
      Check out the birthday wishes
      <br /> <span className="heading-note">from your fans</span>
    </p>
    <img
      className="birthday-balloons"
      src={balloons}
      width={768}
      height={1024}
      alt="Pink and blue heart-shaped birthday balloons"
    />
    <span className="tiny-star star-one" aria-hidden="true">
      ✧
    </span>
    <span className="tiny-star star-two" aria-hidden="true">
      ✧
    </span>
  </section>
)

export default HeadingSection
