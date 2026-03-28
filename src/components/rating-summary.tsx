export const RatingSummary = () => {
  return (
    <div className="rating-summary">
      <div className="score">
        <div className="value">4.6</div>
        <div className="stars">★★★★★</div>
        <span>120K Ratings</span>
      </div>
      <div className="bars">
        <div className="bar">
          <span className="bar-stars">★★★★★</span>
          <div className="track"><div className="fill" style={{ width: "70%" }}></div></div>
        </div>
        <div className="bar">
          <span className="bar-stars">★★★★☆</span>
          <div className="track"><div className="fill" style={{ width: "20%" }}></div></div>
        </div>
        <div className="bar">
          <span className="bar-stars">★★★☆☆</span>
          <div className="track"><div className="fill" style={{ width: "6%" }}></div></div>
        </div>
        <div className="bar">
          <span className="bar-stars">★★☆☆☆</span>
          <div className="track"><div className="fill" style={{ width: "2%" }}></div></div>
        </div>
        <div className="bar">
          <span className="bar-stars">★☆☆☆☆</span>
          <div className="track"><div className="fill" style={{ width: "2%" }}></div></div>
        </div>
      </div>
    </div>
  )
}